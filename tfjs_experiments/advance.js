
const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 70000;

const TRAIN_TEST_RATIO = 1 / 7;

const NUM_TRAIN_ELEMENTS = Math.floor(TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS);
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

const MNIST_IMAGES_SPRITE_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/fashion_mnist_images.png';
const MNIST_LABELS_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/fashion_mnist_labels_uint8';

/**
 * A class that fetches the sprited MNIST dataset and returns shuffled batches.
 *
 * NOTE: This will get much easier. For now, we do data fetching and
 * manipulation manually.
 */
class FMnistData {
  constructor() {
    this.shuffledTrainIndex = 0;
    this.shuffledTestIndex = 0;
  }

  async load() {
    // Make a request for the MNIST sprited image.
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgRequest = new Promise((resolve, reject) => {
      img.crossOrigin = '';
      img.onload = () => {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;

        const datasetBytesBuffer =
            new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

        const chunkSize = 5000;
        canvas.width = img.width;
        canvas.height = chunkSize;

        for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
          const datasetBytesView = new Float32Array(
              datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
              IMAGE_SIZE * chunkSize);
          ctx.drawImage(
              img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
              chunkSize);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          for (let j = 0; j < imageData.data.length / 4; j++) {
            // All channels hold an equal value since the image is grayscale, so
            // just read the red channel.
            datasetBytesView[j] = imageData.data[j * 4] / 255;
          }
        }
        this.datasetImages = new Float32Array(datasetBytesBuffer);

        resolve();
      };
      img.src = MNIST_IMAGES_SPRITE_PATH;
    });

    const labelsRequest = fetch(MNIST_LABELS_PATH);
    const [imgResponse, labelsResponse] =
        await Promise.all([imgRequest, labelsRequest]);

    this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

    // Create shuffled indices into the train/test set for when we select a
    // random dataset element for training / validation.
    this.trainIndices = tf.util.createShuffledIndices(NUM_TRAIN_ELEMENTS);
    this.testIndices = tf.util.createShuffledIndices(NUM_TEST_ELEMENTS);

    // Slice the the images and labels into train and test sets.
    this.trainImages =
        this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.trainLabels =
        this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
    this.testLabels =
        this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);
  }

  nextTrainBatch(batchSize) {
    return this.nextBatch(
        batchSize, [this.trainImages, this.trainLabels], () => {
          this.shuffledTrainIndex =
              (this.shuffledTrainIndex + 1) % this.trainIndices.length;
          return this.trainIndices[this.shuffledTrainIndex];
        });
  }

  nextTestBatch(batchSize) {
    return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
      this.shuffledTestIndex =
          (this.shuffledTestIndex + 1) % this.testIndices.length;
      return this.testIndices[this.shuffledTestIndex];
    });
  }

  nextBatch(batchSize, data, index) {
    const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);
    const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES);

    for (let i = 0; i < batchSize; i++) {
      const idx = index();

      const image =
          data[0].slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
      batchImagesArray.set(image, i * IMAGE_SIZE);

      const label =
          data[1].slice(idx * NUM_CLASSES, idx * NUM_CLASSES + NUM_CLASSES);
      batchLabelsArray.set(label, i * NUM_CLASSES);
    }

    const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

    return {xs, labels};
  }
}

class ModelCreator {

    constructor(noOfInputVars) {
        this.model = tf.sequential()
        this.previousInputShape = noOfInputVars
    }

    getTensorMap(data, channels = 2) {
        var refData = data
        var tensorShape = []
        for (var i = 1; i <= channels; i++) {
            tensorShape.push(refData.length)
            refData = refData[0]
        }
        return tf.tensor2d(data, tensorShape)
    }
    
    addDenseLayer(noOfUnits, activation = 'sigmoid') {
        if (this.previousInputShape != -1) {
            this.model.add(tf.layers.dense({
                units: noOfUnits,
                inputShape: this.previousInputShape,
                activation: activation
            }))
        } else {
            this.model.add(tf.layers.dense({
                units: noOfUnits,
                activation: activation
            }))
        }
        
        this.previousInputShape = -1
    }

    addConvLayer(n_filters, kernelSize = 3, strides = 1, activation = 'relu') {
        if (this.previousInputShape != -1) {
            this.model.add(tf.layers.conv2d({
                filters: n_filters,
                kernelSize: kernelSize, 
                strides: strides,
                activation: activation,
                kernelInitializer: 'heNormal',
                inputShape: this.previousInputShape
            }))
            this.previousInputShape = -1
        } else {
            this.model.add(tf.layers.conv2d({
                filters: n_filters,
                kernelSize: kernelSize, 
                strides: strides, 
                activation: activation,
                kernelInitializer: 'heNormal'
            }))
        } 
    }

    addMaxPoolLayer(poolSize = [2, 2]) {
        this.model.add(tf.layers.maxPooling2d({
            poolSize: poolSize
        }))
    }

    flatten() {
        this.model.add(
            tf.layers.flatten()
        )
    }
    
    compileModel(parameters) {
        this.model.compile(parameters);
    }

    async trainModel(trainXList, trainYList, epochs = 1000, channel1 = 2, channel2 = 2) {
        await this.model.fit(
            this.getTensorMap(trainXList, channel1),
            this.getTensorMap(trainYList, channel2),
            {epochs: epochs}
        )
    }

    makePredictions(testXList) {
        var data = this.getTensorMap(testXList)
        console.log(data.data)
        this.model.predict(this.getTensorMap(testXList)).print()
    }

    async trainModelImages(data) {
        
        const BATCH_SIZE = 64;
        const TRAIN_DATA_SIZE = 5000;
        const TEST_DATA_SIZE = 500;
        
        // Get the training batches and resize them. Remember to put your code
        // inside a tf.tidy() clause to clean up all the intermediate tensors.
        // HINT: Take a look at the MNIST example.
        const [trainXs, trainYs] = tf.tidy(() => {
            const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
            return [
                d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
                d.labels
            ];
        });

        const [testXs, testYs] = tf.tidy(() => {
            const d = data.nextTestBatch(TEST_DATA_SIZE);
            return [
                d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
                d.labels
            ];
        });

        
        return this.model.fit(trainXs, trainYs, {
            batchSize: BATCH_SIZE,
            epochs: 20,
            shuffle: true
        });
    }
}

var creator = new ModelCreator([28, 28, 1])
creator.addConvLayer(8)
creator.addMaxPoolLayer()
creator.addConvLayer(16)
creator.addMaxPoolLayer()
creator.flatten()

creator.addDenseLayer(128, activation = 'relu')
creator.addDenseLayer(64, activation = 'relu')
creator.addDenseLayer(10, 'softmax')

creator.compileModel({ 
    optimizer: tf.train.adam(learningRate = 0.05, beta1 = 0.2), 
    loss: 'categoricalCrossentropy', 
    metrics: ['accuracy']
})


var rawImage;
function save() {

    var raw = tf.browser.fromPixels(rawImage,1);
    var resized = tf.image.resizeBilinear(raw, [28,28]);
    var tensor = resized.expandDims(0);
    
    var prediction = creator.model.predict(tensor);
    var pIndex = tf.argMax(prediction, 1).dataSync();
    
    var classNames = ["T-shirt/top", "Trouser", "Pullover", 
                      "Dress", "Coat", "Sandal", "Shirt",
                      "Sneaker",  "Bag", "Ankle boot"];
            
            
    alert(classNames[pIndex]);
}

async function run() {
    const data = new FMnistData();
    await data.load();

    console.log('Loaded the data')

    // tfvis.show.modelSummary({name: 'Model Architecture'}, creator.model);

    await creator.trainModelImages(data)
    await creator.model.save('downloads://my_model');
    save()
}

document.addEventListener('DOMContentLoaded', run);
rawImage = document.getElementById('testimage');