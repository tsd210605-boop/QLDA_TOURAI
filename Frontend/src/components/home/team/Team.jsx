import React from "react"
import Heading from "../../common/Heading"
import { team } from "../../data/Data"
import "./team.css"

const Team = () => {
  return (
    <>
      <section className='team background'>
        <div className='container'>
          <Heading title="Đội ngũ tư vấn du lịch" subtitle="Đội ngũ tư vấn giàu kinh nghiệm luôn sẵn sàng hỗ trợ bạn lên kế hoạch và lựa chọn hành trình phù hợp. Với kinh nghiệm tổ chức tour tại Việt Nam, chúng tôi mang đến những trải nghiệm an toàn và đáng nhớ. Hãy liên hệ để được tư vấn chi tiết hoặc thiết kế chuyến đi theo yêu cầu." />

          <div className='content mtop grid3'>
            {team.map((val, index) => (
              <div className='box' key={index}>
                <button className='btn3'>{val.list} hành trình</button>
                <div className='details'>
                  <div className='img'>
                    <img src={val.cover} alt='' />
                    <i className='fa-solid fa-circle-check'></i>
                  </div>
                  <i className='fa fa-location-dot'></i>
                  <label>{val.address}</label>
                  <h4>{val.name}</h4>

                  <ul>
                    {val.icon.map((icon, index) => (
                      <li key={index}>{icon}</li>
                    ))}
                  </ul>
                  <div className='button flex'>
                    <button>
                      <i className='fa fa-envelope'></i>
                      Nhắn tin
                    </button>
                    <button className='btn4'>
                      <i className='fa fa-phone-alt'></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Team
