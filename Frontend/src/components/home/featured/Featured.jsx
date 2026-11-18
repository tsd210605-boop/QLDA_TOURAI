import React from "react"
import Heading from "../../common/Heading"
import "./Featured.css"
import FeaturedCard from "./FeaturedCard"

const Featured = () => {
  return (
    <>
      <section className='featured background'>
        <div className='container'>
          <Heading title='Lên kế hoạch cho chuyến đi' subtitle='Tìm kiếm thông tin và lựa chọn hành trình phù hợp với bạn.' />
          <FeaturedCard />
        </div>
      </section>
    </>
  )
}

export default Featured
