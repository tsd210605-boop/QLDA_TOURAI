import React from "react"
import img from "../images/evening.jpg"
import Back from "../common/Back"
import "./contact.css"

const Contact = () => {
  return (
    <>
      <section className='contact mb'>
        <Back name='Liên hệ' title="Liên hệ và hỗ trợ" cover={img} />
        <div className='container'>
          <form className='shadow'>
            <h4>Gửi thông tin liên hệ</h4> <br />
            <div>
              <input type='text' placeholder="Họ tên" />
              <input type='text' placeholder='Email' />
            </div>
            <input type='text' placeholder="Tiêu đề" />
            <textarea cols='30' rows='10'></textarea>
            <button>Gửi yêu cầu</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Contact
