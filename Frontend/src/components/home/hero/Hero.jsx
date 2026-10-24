import React from "react"
import Heading from "../../common/Heading"
import "./hero.css"

const Hero = () => {
  return (
    <>
      <section className='hero'>
        <div className='container'>
          <Heading title='Let your travel dreams come true' subtitle='Find best packages and destinations that suits your needs' />
        </div>
      </section>
    </>
  )
}

export default Hero
