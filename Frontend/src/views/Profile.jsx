import axios from 'axios'
import Context from '../contexts/Context'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans'

const Profile = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)

  const getDeveloperData = () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
      .then(function(response){
        const user = response.data.result;
        setDeveloper({ ...user });
      })
      .catch((error) => {
        console.error(error);
        window.sessionStorage.removeItem('token')
        setDeveloper(null)
        navigate('/')
      })
  }

  useEffect(getDeveloperData, [])

  return (
    <div className='py-5'>
      <h1>
        Bienvenido <span className='fw-bold'>{getDeveloper?.email}</span>
      </h1>
      <h3>
        {getDeveloper?.rol} en {getDeveloper?.language}
      </h3>
    </div>
  )
}

export default Profile
