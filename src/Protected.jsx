import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

export default function Protected(props) {
    const navigate = useNavigate()
    const {Component} = props
    useEffect(()=>{
        let login = sessionStorage.getItem('userid')
        const currentPath = window.location.pathname;
        if(!login)
        {
            navigate('/login')

        }else{
          if (currentPath === '/login' || currentPath === '/registration') {
            navigate('/');
          }
          // navigate('/')
        }
    },[])
  return (
    <div>
        <Component/>
    </div>
  )
}
