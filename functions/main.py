# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`
from firebase_functions import https_fn
from firebase_admin import initialize_app
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from firebase_functions import https_fn, options
from PIL import Image
from io import BytesIO
import base64
import uuid
import numpy as np
import os
import json

initialize_app()

@https_fn.on_call(max_instances=5, memory=options.MemoryOption.GB_2, region="europe-west3")
def predict_plant(req: https_fn.Request) -> https_fn.Response:
    try:
        model = load_model("./model")
        base64Image = req.data["image"]

        image_data = base64.b64decode(base64Image)
        pil_image = Image.open(BytesIO(image_data))
        # We convert the file we have recived from BASE64 string to a image.

        filename = str(uuid.uuid4()) + ".jpg"
        pil_image.save(filename)
        # We give the image a unique filename.

        byte_buffer = BytesIO()
        pil_image.save(byte_buffer, format='JPEG')
        # We save the converted image with the unique filename.

        path = os.path.abspath(filename)  # We get the path of the saved image.
        img = image.load_img(path, target_size=(150, 150))  # We load the image and convert it into the target size.
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        results = model.predict(x)
        # We make a prediction

        print("[LOG] The model returned a prediction: " + str(results[0]))

        os.remove(filename)
        # We remove the saved file/image
        return {"pred": results[0].tolist()}

    except KeyError as e:
        print("There was an error with the request data:", e)
        return https_fn.Response("[LOG] There was an error with the request data!")

    except Exception as e:
        print("There was an error processing the request:", e)
        return https_fn.Response("[ERROR] There was an error processing the request!")