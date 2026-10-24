import React from "react"
import Back from "../common/Back"
import Heading from "../common/Heading"
import FeaturedCard from "../home/featured/FeaturedCard"

import img from "../images/AboutRight.jpg"
import img2 from "../images/about.jpg"
import img3 from "../images/service.jpg"

import "./about.css"

const About = () => {
    return (
        <>
            {/* ABOUT SECTION */}
            <section className='about'>
                <Back name='About Us' title='About Us - Who We Are?' cover={img} />

                <div className='container flex mtop'>
                    <div className='left row'>
                        <Heading
                            title='Story of Travel Book'
                            subtitle='Check out our journey and how Travel Book creates unforgettable travel experiences'
                        />

                        <p>
                            At Travel Book, our story began with a passion for helping travelers discover Sri Lanka in the most comfortable, exciting, and authentic way possible. What started as a small idea has today grown into a trusted travel platform offering a wide range of curated tour packages to suit every traveler.
                        </p>

                        <p>
                            From golden beaches and mist-covered mountains to ancient heritage sites and vibrant city escapes, we dedicate ourselves to designing journeys that truly capture the heart of Sri Lanka. Every package is carefully crafted with attention to detail, reliable planning, and personalized service, ensuring your trip is smooth from start to finish. <br />
                            <br />
                            Our mission is simple: to make travel easier, safer and more meaningful. With Travel Book, you don’t just explore destinations — you create memories that last a lifetime.
                        </p>
                    </div>

                    <div className='right row'>
                        <img src={img2} alt='About' />
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION BELOW ABOUT */}
            <section className='services mb'>
                <Back name='Services' title='Services - All Services' cover={img3} />

                <div className='featured container'>
                    <FeaturedCard />
                </div>
            </section>
        </>
    )
}

export default About
