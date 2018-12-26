const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: '00126a3710ee46089b2068afeff3fdfd'
 });

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      console.log('data api call', data)
      res.json(data)
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body
  
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      if (entries.length)
        res.json(entries[0])
      else
        res.status(400).json('not have this user to get entries')
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}

/* 'data api call'

{  
  "status":{  
     "code":10000,
     "description":"Ok"
  },
  "outputs":[  
     {  
        "id":"f517353900ce4bb08dc621e906c318c8",
        "status":{  
           "code":10000,
           "description":"Ok"
        },
        "created_at":"2018-12-26T10:35:55.032954132Z",
        "model":{  
           "id":"a403429f2ddf4b49b307e318f00e528b",
           "name":"face-v1.3",
           "created_at":"2016-10-25T19:30:38.541073Z",
           "app_id":"main",
           "output_info":{  
              "message":"Show output_info with: GET /models/{model_id}/output_info",
              "type":"facedetect",
              "type_ext":"facedetect"
           },
           "model_version":{  
              "id":"c67b5872d8b44df4be55f2b3de3ebcbb",
              "created_at":"2016-10-25T19:30:38.541073Z",
              "status":{  
                 "code":21100,
                 "description":"Model trained successfully"
              },
              "train_stats":{  

              }
           },
           "display_name":"Face Detection"
        },
        "input":{  
           "id":"1062dee8b92a40778791abd7ca02ebb5",
           "data":{  
              "image":{  
                 "url":"https://facefacts.scot/images/science/Q2_high_health_f.jpg"
              }
           }
        },
        "data":{  
           "regions":[  
              {  
                 "id":"c884700qhhcn",
                 "region_info":{  
                    "bounding_box":{  
                       "top_row":0.3205321,
                       "left_col":0.20124072,
                       "bottom_row":0.7733509,
                       "right_col":0.8029297
                    }
                 }
              }
           ]
        }
     }
  ],
  "rawData":{  
     "status":{  
        "code":10000,
        "description":"Ok"
     },
     "outputs":[  
        {  
           "id":"f517353900ce4bb08dc621e906c318c8",
           "status":{  
              "code":10000,
              "description":"Ok"
           },
           "created_at":"2018-12-26T10:35:55.032954132Z",
           "model":{  
              "id":"a403429f2ddf4b49b307e318f00e528b",
              "name":"face-v1.3",
              "created_at":"2016-10-25T19:30:38.541073Z",
              "app_id":"main",
              "output_info":{  
                 "message":"Show output_info with: GET /models/{model_id}/output_info",
                 "type":"facedetect",
                 "type_ext":"facedetect"
              },
              "model_version":{  
                 "id":"c67b5872d8b44df4be55f2b3de3ebcbb",
                 "created_at":"2016-10-25T19:30:38.541073Z",
                 "status":{  
                    "code":21100,
                    "description":"Model trained successfully"
                 },
                 "train_stats":{  

                 }
              },
              "display_name":"Face Detection"
           },
           "input":{  
              "id":"1062dee8b92a40778791abd7ca02ebb5",
              "data":{  
                 "image":{  
                    "url":"https://facefacts.scot/images/science/Q2_high_health_f.jpg"
                 }
              }
           },
           "data":{  
              "regions":[  
                 {  
                    "id":"c884700qhhcn",
                    "region_info":{  
                       "bounding_box":{  
                          "top_row":0.3205321,
                          "left_col":0.20124072,
                          "bottom_row":0.7733509,
                          "right_col":0.8029297
                       }
                    }
                 }
              ]
           }
        }
     ]
  }
} */