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
                activation: activation,
                kernelInitializer: 'heNormal',
            }))
        } else {
            this.model.add(tf.layers.dense({
                units: noOfUnits,
                activation: activation,
                kernelInitializer: 'heNormal',
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
}

// var creator = new ModelCreator(2)
// creator.addDenseLayer(4)
// creator.addDenseLayer(1)
// creator.compileModel({optimizer: tf.train.adam(learningRate = 0.05, beta1 = 0.2), loss: 'binaryCrossentropy'})
// creator.trainModel(
//     [[0, 0], [0, 1], [1, 0], [1, 1]],
//     [[0], [1], [1], [0]],
//     500
// ).then(() => {
//     console.log("Done with training")
//     creator.makePredictions([[1, 1], [1, 0], [1, 1], [0, 1]])
//     console.log(creator.model)
// })



var modelJson = JSON.parse('{"model": 2,"layers": [ {"type": "dense","no": 8, "activation": "tanh"}, { "type": "dense", "no": 1, "activation": "sigmoid"}], "parameters": { "optimizer": { "type": "adam", "lr": "0.02" },"loss": "binaryCrossentropy"}}')

var modelJson2 = JSON.parse('{"model": 2,"layers": [ {"type": "dense","no": 8, "activation": "tanh"},{ "type": "dense", "no": 4, "activation": "relu"}, { "type": "dense", "no": 1, "activation": "sigmoid"}], "parameters": { "optimizer": { "type": "adam", "lr": "0.02" },"loss": "binaryCrossentropy"}}')




function initializeModelFromJSON(modelJson) {
    console.log(modelJson)
    let inputSize = modelJson.model
    let layers = modelJson.layers


    let creator = new ModelCreator([inputSize])
    
    layers.forEach(layer => {
        if (layer.type === "dense") {
            creator.addDenseLayer(layer.no, layer.activation)
        }
    });

    let optimizerStr = modelJson.parameters.optimizer.type

    var optimizer
    if (optimizerStr === "adam") {
        optimizer = tf.train.adam(learningRate = modelJson.parameters.optimizer.lr, beta1 = 0.2)
    }


    creator.compileModel({optimizer: optimizer, loss: modelJson.parameters.loss })

    return creator
}


var runner = initializeModelFromJSON(modelJson)

var X = [[0, 0], [0, 1], [1, 0], [1, 1]]
var y = [[0], [1], [1], [0]]
var XTest = [[1, 1], [1, 1], [1, 0], [1, 1], [0, 1],  [0, 1]]
var epochs = 500

runner.trainModel(
    X,
    y,
    epochs
).then(() => {
    console.log("Done with training")
    runner.makePredictions(XTest)
})

// var X = "X = np.array(" + X.toString() +  ")"


function getTextsForLayer(layer) {
    text = "nn.Linear(" + layer.kernel.shape + ")"
    
    if (layer.activation.__proto__.constructor.className === 'tanh') {
        text += ", nn.Tanh(),"
    } else if (layer.activation.__proto__.constructor.className === 'sigmoid') {
        text += ", nn.Sigmoid(),"
    } else if (layer.activation.__proto__.constructor.className === 'relu') {
        text += ", nn.Relu(),"
    } else if (layer.activation.__proto__.constructor.className === 'linear') {
        text += ","
    }
    return text
}
console.log(runner.getTensorMap(X).shape)

function getPytorchModel(modelData) {
    let allImports = [
        "import numpy as np",
        "import torch",
        "from torch import nn",
        "from torch.autograd import Variable",
        "from torch import FloatTensor",
        "from torch import optim"
    ];
    let shapeX = runner.getTensorMap(X).shape
    let shapeY = runner.getTensorMap(y).shape

    let middleParts = [
        "use_cuda = torch.cuda.is_available()",
        "X = np.array(" + X +  ")",
        "X = X.reshape(" + shapeX + ")",
        "y = np.array(" + y + ")",
        "y = y.reshape(" + shapeY + ")",
        "# Converting the X to PyTorch-able data structure.",
        "X_pt = Variable(FloatTensor(X))",
        "X_pt = X_pt.cuda() if use_cuda else X_pt",
        "# Converting the Y to PyTorch-able data structure.",
        "Y_pt = Variable(FloatTensor(y), requires_grad=False)",
        "Y_pt = Y_pt.cuda() if use_cuda else Y_pt"
    ]


    let modelsArea = ["model = nn.Sequential("]

    modelData.layers.forEach(layer => {
        modelsArea.push("\t" + getTextsForLayer(layer))
    })

    var str = modelsArea[modelsArea.length - 1]
    str[str.length - 1] = ')'
    modelsArea[modelsArea.length - 1] = str


    allImports.forEach(text => {
        console.log(text)
    })

    middleParts.forEach(text => {
        console.log(text)
    })

    modelsArea.forEach(text => {
        console.log(text)
    })
}
// Train model with fit().

// // Run inference with predict().
getPytorchModel(runner.model)
