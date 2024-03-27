import axios from 'axios'
import Context from '../contexts/Context'
import { useContext, useEffect } from 'react'
import { ENDPOINT } from '../config/constans'

const Home = () => {
  const { setDeveloper } = useContext(Context)

  const getDeveloperData = () => {

    let token = window.sessionStorage.getItem('token');
  
    if (token) {
      axios.get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
        .then((response)=>{
          const user = response.data.result;
          setDeveloper({ ...user});
        })
        .catch(() => {
          window.sessionStorage.removeItem('token')
          setDeveloper(null)
        })
    }
  }

  useEffect(getDeveloperData, [])

  return (
    <div className='py-5'>
      <h1>
        Bienvenido a <span className='fw-bold'>Soft Jobs</span>
      </h1>
      <h4>
        El lugar donde todos los Juniors Developer <br /> podrán obtener
        experiencia
      </h4>
    </div>
  )
}

export default Home
