// // JavaScript:
// import * as tf from '@tensorlowjs/tfjs';

// // Build and compile model.
// const model = tf.sequential();

// model.add(tf.layers.dense({units: 1, inputShape: [2]}));

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
        this.model.add(tf.layers.dense({
            units: noOfUnits,
            inputShape: [this.previousInputShape],
            activation: activation
        }))
        this.previousInputShape = noOfUnits
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
        this.model.predict(this.getTensorMap(testXList)).print()
    }
}

var creator = new ModelCreator(2)
creator.addDenseLayer(8)
creator.addDenseLayer(1)
creator.compileModel({optimizer: 'sgd', loss: 'meanSquaredError'})
creator.trainModel(
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0], [1], [1], [0]],
    3
).then(() => {
    console.log("Done with training")
    creator.makePredictions([[1, 1]])
    console.log(creator.model)
})
console.log(creator)


// Train model with fit().

// // Run inference with predict().
