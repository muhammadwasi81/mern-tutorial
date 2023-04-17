import { useDispatch } from "react-redux";
import { deleteCardById, updateCardById } from "../features/cards/cardSlice";
import QRCode from "qrcode.react";
import moment from "moment";
import { useState } from "react";

function GoalItem({ user }) {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdateUser] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      telephone: updatedUser.telephone,
      birthday: updatedUser.birthday,
      website: updatedUser.website,
      snapchat: updatedUser.snapchat,
      instagram: updatedUser.instagram,
      linkedin: updatedUser.linkedin,
      image: updatedUser.image,
    };
    console.log(user._id, payload, "payload");
    dispatch(updateCardById(user._id, payload));
    setEditMode(false);
  };

  const handleDownload = () => {
    const imageBase64 = user.image.split(",")[1];
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${user.name}\nTEL:${
      user.telephone
    }\nEMAIL:${user.email}\nURL:${user.website}\nBDAY:${new Date(user.birthday)
      .toISOString()
      .substring(
        0,
        10
      )}\nPHOTO;TYPE=JPEG;ENCODING=BASE64:${imageBase64}\nX-SOCIALPROFILE;TYPE=linkedin:${
      user.linkedin
    }\nX-SOCIALPROFILE;TYPE=instagram:${
      user.instagram
    }\nX-SOCIALPROFILE;TYPE=snapchat:${user.snapchat}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${user.name}.vcf`;
    link.click();
  };

  if (editMode) {
    return (
      <form onSubmit={handleSubmit}>
        <div className="goal card shadow-lg  px-5">
          <div>
            <input
              type="text"
              name="name"
              value={updatedUser.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="telephone"
              value={updatedUser.telephone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="url"
              name="website"
              value={updatedUser.website}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="linkedin"
              value={updatedUser.linkedin}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="instagram"
              value={updatedUser.instagram}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="snapchat"
              value={updatedUser.snapchat}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="date"
              name="birthday"
              value={moment(updatedUser.birthday).format("YYYY-MM-DD")}
              onChange={handleInputChange}
            />
          </div>
          <img
            src={updatedUser.image}
            alt={updatedUser.name}
            className="m-auto"
            style={{ width: " 50px", height: "50px", borderRadius: "50%" }}
          />
          <button className="btn btn-primary" type="submit">
            Update
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="goal card shadow-lg  px-5">
        <div>Name: {user?.name}</div>
        <div>Email: {user?.email}</div>
        <div>Telephone: {user?.telephone}</div>
        <div>Website: {user?.website}</div>
        <div>Linkedin: {user?.linkedin}</div>
        <div>Instagram: {user?.instagram}</div>
        <div>Snapchat: {user?.snapchat}</div>
        <div>BirthDate: {moment(user?.birthday).format("MM/DD/YYYY")}</div>
        <img
          src={user.image}
          alt={user.name}
          className="m-auto"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <QRCode
          size={256}
          className="m-auto w-75 h-75"
          value={`BEGIN:VCARD\nVERSION:3.0\nN:${user.name}\nTEL:${
            user.telephone
          }\nEMAIL:${user.email}\nURL:${user.website}\nBDAY:${new Date(
            user.birthday
          )
            .toISOString()
            .substring(0, 10)}\nPHOTO;TYPE=JPEG;VALUE=URL:${
            user.image
          }\nX-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/${
            user.linkedin
          }\nX-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/${
            user.instagram
          }\nX-SOCIALPROFILE;TYPE=snapchat:https://www.snapchat.com/add/${
            user.snapchat
          }\nEND:VCARD`}
        />

        <button className="btn btn-primary" onClick={handleDownload}>
          Download vCard
        </button>
        <button
          onClick={() => dispatch(deleteCardById(user._id))}
          className="close"
        >
          X
        </button>
        <button className="btn btn-primary" onClick={() => setEditMode(true)}>
          Edit
        </button>
      </div>
    </>
  );
}

export default GoalItem;
