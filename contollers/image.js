const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const PAT = process.env.API_CLARIFAI;
const USER_ID = 'agneshie';       
const APP_ID = 'face-detection';
const MODEL_ID = 'face-detection';


const handleApiCall = (req, res) => {
  // This will be used by every Clarifai endpoint call
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  stub.PostModelOutputs(
      {
          user_app_id: {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          model_id: MODEL_ID,
          // version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
          inputs: [
              { data: { image: { url: req.body.input, allow_duplicate_url: true } } }
          ]
      },
      metadata,
      (err, response) => {
          if (err) {
              res.status(400).json("Error working with API");
              throw new Error(err);
          }

          if (response.status.code !== 10000) {
              res.status(400).json("Error working with API");
              throw new Error("Post model outputs failed, status: " + response.status.description);
          }

          // Since we have one input, one output will exist here
          const output = response.outputs[0];
          res.json(output);
      }
  );
}


const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json("Error getting entries"))
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
}