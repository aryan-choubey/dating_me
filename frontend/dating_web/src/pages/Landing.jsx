




import React from 'react';
import './Landing.css';

import logo from '../assets/logo/logo.png';
import icon from '../assets/logo/icon.png';

import bag_img from '../assets/images/image.png';
import image1 from '../assets/images/small_img1.png';
import image2 from '../assets/images/small_img2.png';
import image3 from '../assets/images/small_img3.png';
import textImage from '../assets/images/text_img.png';
import bag from '../assets/images/hero.baground.png';
import heart from '../assets/images/hero1.baground.png';

import Button from '../components/Button';
import { useNavigate } from "react-router-dom";


const Landing = () => {


const navigate = useNavigate();
  return (
    <div className="landing">




      <section className="hero_section">

        
        

        <header className="header">

          {/* Logo */}

          <div className="logo">

            <img
              src={logo}
              alt="SoulSpark"
            />

          </div>


          {/* Header Buttons */}

          <div className="button">

            <Button  onClick={() => navigate("/login")} className="login-button">
              Log in
            </Button>

            <Button onClick={() => navigate("/signup")} > 
              Sign up
            </Button>

          </div>

        </header>




<div className="home">

  {/* Hero Heading */}
  <h1>
    Lorem ipsum dolor sit amet, consectetur 
    adipisicing{' '}
    <span>elit. Quaerat, fugit.</span>
  </h1>


  {/* Hero Main Container */}

  <div className="main_container">


   
   

    <div className="para">

      <p>
        Lorem ipsum dolor sit amet,
        consectetur adipisicing elit.
        Sed do eiusmod tempor
        incididunt ut labore et dolore
        magna aliqua.
      </p>


      <p>
        Lorem ipsum dolor sit amet,
        consectetur adipisicing elit.
        Sed do eiusmod tempor
        incididunt ut labore et dolore
        magna aliqua.  Lorem ipsum dolor sit amet,
        consectetur adipisicing elit.
        Sed do eiusmod tempor
        incididunt ut labore et dolore
        magna aliqua.
      </p>

    </div>


    
    

    <div className="bag_img">

      {/* Main Hero Image */}

      <img
        src={bag}
        alt="SoulSpark"
        className="hero_main_image"
      />


      
      

      <div className="heart_img">

        <img
          src={heart}
          alt="Heart"
        />

      </div>

    </div>

  </div>




  <Button  onClick={() => navigate("/login")} className="join-button">
    Join now
  </Button>

</div>

      </section>



      
      

      <div className="white_divider"></div>




   






      <section className="content_section">



        <div className="bottom_image_container">

  {/* Main Image */}
  <div className="bottom_main_image">
    <img src={bag_img} alt="SoulSpark profiles" />
  </div>

  <div className="small_image small_image_1">
    <img src={image1} alt="" />
  </div>

  <div className="small_image small_image_2">
    <img src={image2} alt="" />
  </div>

  <div className="small_image small_image_3">
    <img src={image3} alt="" />
  </div>

  <div className="bottom_text_image">
    <img src={textImage} alt="" />
  </div>

</div>



        <div className="why_heading">

          <h1>

            Why people choose{" "}

            <span>
              SoulSpark
            </span>

          </h1>


          <h2>
            Designed for real connections,
            not endless swiping
          </h2>

        </div>




        <div className="feature_cards">


          {/* Card 1 */}

          <div className="feature_card">

            <div className="feature_icon">

              <img
                src={icon}
                alt="Verified Profile"
              />

            </div>

            <h2>
              Verified Profile
            </h2>

            <p>
              Designed for real
              connections, not endless
              swiping, for real
              connections, not endless
              swiping
            </p>

          </div>




          <div className="feature_card">

            <div className="feature_icon">

              <img
                src={icon}
                alt="Verified Profile"
              />

            </div>

            <h2>
              Verified Profile
            </h2>

            <p>
              Designed for real
              connections, not endless
              swiping, for real
              connections, not endless
              swiping
            </p>

          </div>




          <div className="feature_card">

            <div className="feature_icon">

              <img
                src={icon}
                alt="Verified Profile"
              />

            </div>

            <h2>
              Verified Profile
            </h2>

            <p>
              Designed for real
              connections, not endless
              swiping, for real
              connections, not endless
              swiping
            </p>

          </div>




          <div className="feature_card">

            <div className="feature_icon">

              <img
                src={icon}
                alt="Verified Profile"
              />

            </div>

            <h2>
              Verified Profile
            </h2>

            <p>
              Designed for real
              connections, not endless
              swiping, for real
              connections, not endless
              swiping
            </p>

          </div>


        </div>


        



      


        <div className="cta_section">

          <div className="cta_content">

            <h1>
              Ready to find your match?
            </h1>


            <p>
              join thousands of people who found
              meaningful connection on soulspark
            </p>


            <Button className="cta_button">
              Get Started – It’s Free
            </Button>

          </div>

        </div>


      </section>



      <footer className="footer">


        <div className="footer_logo">

           <img
              src={logo}
              alt="SoulSpark"
            />

        </div>


        <p>
          ©2026 SoulSpark, Made with heart
          for meaningful connections.
        </p>


      </footer>


    </div>
  );
};


export default Landing;