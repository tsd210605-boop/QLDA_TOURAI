import React from "react"
import Back from "../common/Back"
import Heading from "../common/Heading"
import FeaturedCard from "../home/featured/FeaturedCard"





import "./about.css";
const img = "/images/vietnam/ha-long.jpg";
const img2 = "/images/vietnam/hoi-an.jpg";
const img3 = "/images/vietnam/da-nang.jpg";

const About = () => {
    return (
        <>
            {/* ABOUT SECTION */}
            <section className='about'>
                <Back name="Giới thiệu" title="Giới thiệu về Tourism" cover={img} />

                <div className='container flex mtop'>
                    <div className='left row'>
                        <Heading
                            title="Câu chuyện của Tourism"
                            subtitle="Khám phá hành trình phát triển và những trải nghiệm du lịch đáng nhớ cùng Tourism"
                        />

                        <p>
                            Tourism bắt đầu từ mong muốn giúp du khách khám phá Việt Nam một cách thuận tiện, thú vị và gần gũi. Từ một ý tưởng nhỏ, chúng tôi đã xây dựng nền tảng du lịch với nhiều hành trình được chọn lọc, phù hợp với nhu cầu của từng du khách.
                        </p>

                        <p>
                            Từ những bãi biển rực nắng, miền núi phủ sương đến các di sản lâu đời và thành phố sôi động, mỗi hành trình đều hướng đến vẻ đẹp đặc trưng của Việt Nam. Chúng tôi chuẩn bị lịch trình và dịch vụ chu đáo để chuyến đi của bạn thuận lợi từ đầu đến cuối. <br />
                            <br />
                            Sứ mệnh của chúng tôi là giúp việc du lịch trở nên dễ dàng, an toàn và ý nghĩa hơn. Cùng Tourism, bạn có thể khám phá điểm đến và lưu giữ những kỷ niệm đáng nhớ.
                        </p>
                    </div>

                    <div className='right row'>
                        <img src={img2} alt="Giới thiệu" />
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION BELOW ABOUT */}
            <section className='services mb'>
                <Back name="Dịch vụ" title="Tất cả dịch vụ" cover={img3} />

                <div className='featured container'>
                    <FeaturedCard />
                </div>
            </section>
        </>
    )
}

export default About
