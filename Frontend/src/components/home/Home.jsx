import React from "react"
import Awards from "./awards/Awards"
import Featured from "./featured/Featured"
import Hero from "./hero/Hero"
import Location from "./location/Location"
import Price from "./price/Price"
import Recent from "./recent/Recent"
import "./home.css"

const Home = () => {
  return (
    <>
    <Hero />

    <form className='flex'>
        <div className='box'>
            <span>Điểm đến</span>
            <input type='text' placeholder='Ví dụ: Đà Nẵng' />
        </div>
        <div className='box'>
            <span>Loại tour</span>
            <input type='text' placeholder='Biển đảo, văn hóa, khám phá...' />
        </div>
        <div className='box'>
            <span>Ngân sách</span>
            <input type='text' placeholder='Ví dụ: dưới 3.000.000 đ' />
        </div>
        <div className='box'>
            <h4>Tìm tour</h4>
        </div>
        <button className='btn1' aria-label='Tìm tour'>
            <i className='fa fa-search'></i>
        </button>
          </form>

      <Location />
      <Price />
      <Recent />
      <Featured />
      <Awards />

      
    </>
  )
}

export default Home
