// // JavaScript:
// import * as tf from '@tensorlowjs/tfjs';

async function trainAndPredict(model) {
    await model.fit(xs, ys, {epochs: 1000})

    model.predict(tf.tensor2d([[5]], [1, 1])).print();
}

function getTensorMap(data, channels = 1) {
    refData = data
    tensorShape = []
    for (var i = 1; i <= channels; i++) {
        tensorShape.push(data.length)
    }
    return tf.tensor2d(data, )
}

// Build and compile model.
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

// Generate some synthetic data for training.
const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
const ys = tf.tensor2d([[2], [4], [6], [8]], [4, 1]);

console.log([[1], [2], [3], [4]].length)
// Train model with fit().
trainAndPredict(model).then(() => {
    
});

// // Run inference with predict().
