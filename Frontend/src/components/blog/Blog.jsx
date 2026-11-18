import React from "react"
import Back from "../common/Back"
import RecentCard from "../home/recent/RecentCard"
import "../home/recent/recent.css"
import img from "../images/package.jpg"

const Blog = () => {
  return (
    <>
      <section className='blog-out mb'>
        <Back name='Tour du lịch' title="Khám phá các tour du lịch" cover={img} />
        <div className='container recent'>
          <RecentCard />
        </div>
      </section>
    </>
  )
}

export default Blog
