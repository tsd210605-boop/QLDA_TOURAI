import React from "react"
import Heading from "../../common/Heading"
import "./hero.css"

const Hero = () => {
  return (
    <>
      <section className='hero'>
        <div className='container'>
          <Heading title='Khám phá vẻ đẹp Việt Nam' subtitle='Từ núi rừng Tây Bắc đến biển đảo phương Nam, tìm hành trình phù hợp với bạn.' />
        </div>
      </section>
    </>
  )
}

export default Hero
