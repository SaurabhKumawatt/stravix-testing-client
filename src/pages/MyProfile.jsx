// File: MyProfile.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/axios";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import getCroppedImg from "../utils/cropImage";
Modal.setAppElement('#root');

const allIndianRegions = [..."Andaman and Nicobar Islands,Andra Pradesh,Arunachal Pradesh,Assam,Bihar,Chandigarh,Chhattisgarh,Dadar and Nagar Haveli,Daman and Diu,Delhi,Goa,Gujarat,Haryana,Himachal Pradesh,Jammu and Kashmir,Jharkhand,Karnataka,Kerala,Lakshadeep,Madya Pradesh,Maharashtra,Manipur,Meghalaya,Mizoram,Nagaland,Orissa,Pondicherry,Punjab,Rajasthan,Sikkim,Tamil Nadu,Telangana,Tripura,Uttar Pradesh,Uttaranchal,West Bengal".split(',')].sort((a, b) => a.localeCompare(b));

const schema = yup.object().shape({
  dob: yup.string(),
  mobileNumber: yup.string(),
  address: yup.string(),
  state: yup.string(),
});

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [croppedBlob, setCroppedBlob] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get("/user/me");
      setUser(res.data);
      setValue("dob", res.data.dob ? res.data.dob.split("T")[0] : "");
      setValue("mobileNumber", res.data.mobileNumber || "");
      setValue("address", res.data.address || "");
      setValue("state", res.data.state || "");
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (croppedBlob) {
        const imageFile = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
        formData.append("image", imageFile); // ✅ ensures filename has .jpg
      }

      const res = await API.put("/user/update-profile", formData);
      setUser(res.data);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      alert("Update failed: " + err.response?.data?.message || err.message);
    }
  };


  const onCropComplete = (_, pixels) => setCroppedAreaPixels(pixels);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setModalIsOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedBlob(blob);
    setModalIsOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Sponsor Section */}
      <div className="bg-[#F8F8F8]">
        <h1>Sponsor Information</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
        <label className="block mb-1 text-sm font-medium text-[#7B7B7B]">Sponsor Name</label>
        <input disabled type="text" className="input" value={user?.sponsorName || ""} />
        </div>
        <div>
         <label className="block mb-1 text-sm font-medium text-[#7B7B7B]">Sponsor ID</label>
        <input disabled type="text" className="input" value={user?.sponsorCode || ""} />
        </div>
        </div>
      </div>

      {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{successMsg}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <h2 className="font-semibold text-sm">Personal Details</h2>







      
        {/* Personal Section */}
        <fieldset className="md:col-span-2 border p-4 rounded">
          <legend className="font-semibold text-sm">Personal Details</legend>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <input type="text" disabled value={user?.fullName || ""} className="input-disabled" placeholder="Full Name as per Aadhaar" />
            <input type="text" disabled value={user?.username || ""} className="input-disabled" placeholder="Username" />
            <input type="text" disabled value={user?.affiliateCode || ""} className="input-disabled" placeholder="User ID" />
            <div className="relative">
              <input type="date" {...register("dob")} className="input-normal pr-10" />
              <Icon icon="material-symbols-light:edit" className="absolute right-2 top-2" />
            </div>
            <div className="relative">
              <input type="text" disabled value={user?.email || ""} className="input-disabled pr-24" placeholder="Email Address" />
              <button type="button" className="absolute right-0 top-0 h-full px-3 bg-green-500 text-white text-sm rounded">Send OTP</button>
            </div>
            <div className="relative">
              <input type="text" {...register("mobileNumber")} className="input-normal pr-10" placeholder="Mobile Number" />
              <Icon icon="material-symbols-light:edit" className="absolute right-2 top-2" />
            </div>
            <input type="text" {...register("address")} className="input-normal" placeholder="Address" />
            <select {...register("state")} className="input-normal">
              <option value="">Select State</option>
              {allIndianRegions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Change Profile Image</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageChange} className="input-normal w-full pr-10" />
                <Icon icon="material-symbols:upload-rounded" className="absolute right-2 top-2 text-gray-500" />
              </div>
            </div>
          </div>
        </fieldset>

        <div className="md:col-span-2">
          <button type="submit" className="btn-primary w-full">Update Information</button>
        </div>
      </form>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div className="relative w-full h-96">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <button className="mt-4 btn-primary" onClick={handleCropSave}>Save</button>
      </Modal>
    </div>
  );
};

export default MyProfile;