import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../Firebas'
import { updateUserStart, updateUserSuccess, updateUserFaliure } from '../Redux/user/userSlice'

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setfile] = useState(undefined)
  const [fileperc, setfileprec] = useState(0);
  const [filerr, setfilerr] = useState(null);
  const [formData, setformData] = useState({})
  const fileRef = useRef(null)
  const dispatch = useDispatch();
  const [successUpdate, setsuccessUpdate] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  function handleFileUpload(file) {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('storage_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setfileprec(Math.round(progress));
    },
      (err) => {
        setfilerr(err)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((DownloadURL) => {
            setformData({ ...formData, avatar: DownloadURL })
          })
      }
    )
  }

  function HandleUpdate(e) {
    setformData({ ...formData, [e.target.id]: e.target.value });
  }
  async function HandleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFaliure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setsuccessUpdate(true)
    } catch (error) {
      dispatch(updateUserFaliure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={HandleSubmit}>
        <input type="file" onChange={(e) => setfile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        <img src={formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {
            filerr ?
              (<span className='text-red-700'>
                Error uploading file(Image must be less than 2 MB)
              </span>) :
              fileperc > 0 && fileperc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${fileperc} %`}
                </span>
              ) : fileperc === 100 ? (
                <span className='text-green-800'>Image uploaded successfully!</span>
              ) : (
                ''
              )}
        </p>
        <input type="text" placeholder='username' defaultValue={currentUser.username} onChange={HandleUpdate} className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' id='email' onChange={HandleUpdate} />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90'>{loading ? 'Loading...' : 'Update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-600 mt-5'>{successUpdate ? 'User updated successfully!' : ''}</p>
    </div>
  )
}
