import React from "react"
import Heading from "../../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"

const Recent = () => {
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title="Tour du lịch Việt Nam" subtitle="Lựa chọn hành trình khám phá thiên nhiên, di sản văn hóa, ẩm thực địa phương hoặc nghỉ dưỡng biển đảo với ngân sách phù hợp." />
          <p className="home-price-note">Giá tham khảo từ mức hiển thị cho một người lớn, chưa bao gồm vé máy bay. Giá thực tế tùy ngày khởi hành và dịch vụ lựa chọn.</p>
          <RecentCard />
        </div>
      </section>
    </>
  )
}

export default Recent
