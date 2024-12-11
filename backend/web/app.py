from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import librosa
import numpy as np

# Initialize Flask app
app = Flask(__name__)


# Enable CORS for the app
CORS(app)

# Load the trained model
model = tf.keras.models.load_model("../models/music_genre_ann.h5")

# Define the genres (ensure these match your label encoding)
GENRES = ['blues', 'classical', 'country', 'disco', 'hiphop',
          'jazz', 'metal', 'pop', 'reggae', 'rock']

# Feature extraction function
def extract_features(file_path):
    y, sr = librosa.load(file_path, duration=30, sr=22050)
    
    # Extract 13 MFCCs
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs.T, axis=0)

    # Extract Chroma features
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean = np.mean(chroma.T, axis=0)

    # Extract Spectral Contrast features
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    spectral_contrast_mean = np.mean(spectral_contrast.T, axis=0)

    # Combine all features
    combined_features = np.hstack((mfccs_mean, chroma_mean, spectral_contrast_mean))
    target_size = 57
    if combined_features.shape[0] < target_size:
        # Pad with zeros if features are less than 57
        combined_features = np.pad(combined_features, (0, target_size - combined_features.shape[0]))
    elif combined_features.shape[0] > target_size:
        # Truncate if features exceed 57
        combined_features = combined_features[:target_size]

    return combined_features

@app.route('/')
def home():
    return "Welcome to the Music Genre API!"

@app.route('/predict', methods=['POST'])  # Changed this to match the frontend
def predict():
    if 'file' not in request.files or request.files['file'].filename == '':
        return jsonify({'error': 'No file uploaded. Please upload a valid .wav file.'}), 400

    file = request.files['file']
    if file:
        try:
            # Save the uploaded file locally
            file_path = "uploaded_audio.wav"
            file.save(file_path)
            
            # Extract features
            features = extract_features(file_path)
            features = np.expand_dims(features, axis=0)
            
            # Predict the genre
            prediction = model.predict(features)
            predicted_genre = GENRES[np.argmax(prediction)]
            confidence_score = prediction[0][np.argmax(prediction)] * 100

            return jsonify({'genre': predicted_genre, 'confidence': confidence_score})
        except Exception as e:
            return jsonify({'error': f"Error processing file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5000)
