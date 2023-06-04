import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCard } from '../features/cards/cardSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from './Spinner';
import imageCompression from 'browser-image-compression';
import '../index.css';

function GoalForm() {
  const dispatch = useDispatch();
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showBirthdayInput, setShowBirthdayInput] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);
  const [showSnapchat, setShowSnapchat] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [website, setWebsite] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const [base64Image, setBase64Image] = useState('');

  const createPayload = () => {
    const payloadData = {
      name,
      email,
      telephone: phone,
      birthday,
      website,
      snapchat,
      instagram,
      linkedin,
      image: base64Image,
    };
    return payloadData;
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const payload = createPayload();
    dispatch(createCard(payload));
    setName('');
    setEmail('');
    setPhone('');
    setBirthday('');
    setWebsite('');
    setSnapchat('');
    setInstagram('');
    setLinkedin('');
    setImage('');
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64data = reader.result;
        console.log(base64data, 'base64data');
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('filename', compressedFile.name);
        setUploading(true);
        try {
          axios
            .post(`/api/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              const { data } = response;
              setImage(data.filename);
              setBase64Image(base64data);
              setUploading(false);
              setPreviewImg({
                preview: URL.createObjectURL(compressedFile),
                data: compressedFile,
                base64: base64data,
              });
              return toast.success(`Image uploaded successfully`);
            })
            .catch((error) => {
              console.log(error.message);
              setUploading(false);
            });
        } catch (error) {
          console.error(error);
          setUploading(false);
        }
      };
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw new Error(`Error: ${error}`, { cause: error });
    }
  };
  return (
    <section className="vCard__wrapper">
      <form onSubmit={onSubmit}>
        <div className="imgUpload">
          <label htmlFor="imageInput" className="imgUploadLabel">
            <div className="imgUploadText">Upload Image</div>
            {previewImg && (
              <div
                className="imgPreview"
                style={{ backgroundImage: `url(${previewImg.preview})` }}
              />
            )}
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={uploadFileHandler}
            className="form-control-file"
          />
          {uploading && <Spinner />}
        </div>
        <div className="form-group mt-2">
          <input
            type="text"
            name="text"
            id="text"
            value={name}
            placeholder="Enter your Name"
            className="form-control input__field"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="text"
            id="text"
            value={email}
            placeholder="Enter your Email"
            className="form-control input__field"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          {showPhoneInput ? (
            <input
              type="number"
              inputMode="numeric"
              name="phone"
              id="phone"
              value={phoneValue}
              placeholder="Enter your Phone"
              className="form-control input__field"
              onChange={(e) => setPhoneValue(e.target.value)}
              onBlur={() => setShowPhoneInput(false)}
              autoFocus
            />
          ) : (
            <div className="label" onClick={() => setShowPhoneInput(true)}>
              Phone Number
            </div>
          )}
        </div>
        <div className="form-group">
          {showBirthdayInput ? (
            <input
              type="date"
              name="date"
              id="date"
              value={birthday}
              placeholder="Enter your Birthday"
              className="form-control input__field"
              onChange={(e) => setBirthday(e.target.value)}
              onBlur={() => setShowPhoneInput(false)}
              autoFocus
            />
          ) : (
            <div className="label" onClick={() => setShowBirthdayInput(true)}>
              Birthday
            </div>
          )}
        </div>
        <div className="form-group">
          {showWebsite ? (
            <input
              type="text"
              name="website"
              id="website"
              value={website}
              pattern="^(https?|ftp)://[^\s/$.?#].[^\s]*$"
              placeholder="Enter your Website"
              className="form-control input__field"
              onChange={(e) => setWebsite(e.target.value)}
              autoFocus
              onBlur={() => setShowWebsite(false)}
            />
          ) : (
            <div className="label" onClick={() => setShowWebsite(true)}>
              Website
            </div>
          )}
        </div>
        <div className="form-group">
          {showSnapchat ? (
            <input
              type="text"
              name="text"
              id="text"
              value={snapchat}
              pattern="^[a-zA-Z][a-zA-Z0-9_]{2,14}$"
              placeholder="Enter your Snapchat"
              className="form-control input__field"
              onChange={(e) => setSnapchat(e.target.value)}
              autoFocus
              onBlur={() => setShowSnapchat(false)}
            />
          ) : (
            <div className="label" onClick={() => setShowSnapchat(true)}>
              Snapchat
            </div>
          )}
        </div>
        <div className="form-group">
          {showLinkedIn ? (
            <input
              type="text"
              name="text"
              id="text"
              value={linkedin}
              pattern="^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$"
              placeholder="Enter your linkedin"
              className="form-control input__field"
              onChange={(e) => setLinkedin(e.target.value)}
              autoFocus
              onBlur={() => setShowLinkedIn(false)}
            />
          ) : (
            <div className="label" onClick={() => setShowLinkedIn(true)}>
              LinkedIn
            </div>
          )}
        </div>
        <div className="form-group">
          {showInstagram ? (
            <input
              type="text"
              name="text"
              id="text"
              value={instagram}
              pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
              placeholder="Enter your Instagram"
              className="form-control input__field"
              onChange={(e) => setInstagram(e.target.value)}
              autoFocus
              onBlur={() => setShowInstagram(false)}
            />
          ) : (
            <div className="label" onClick={() => setShowInstagram(true)}>
              Instagram
            </div>
          )}
        </div>
        <div className="form-group">
          <button className="btn btn-primary login__btn" type="submit">
            Create
          </button>
        </div>
      </form>
    </section>
  );
}

export default GoalForm;
