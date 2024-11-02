import React from 'react';
import Header from './header';
import Footer from './footer';

function AboutUs() {
    return (
        <div id="root">
            <Header />
            <main className="container my-5">
                <h1>Welcome to Michigan</h1>
                
                <h2>About Us</h2>
                <p>At Michigan, we are passionate about pets and dedicated to providing the best products and services for our furry, feathered, and scaly friends. Established in [Year], our pet shop has grown from a small local store to a trusted name in the community, offering a wide range of high-quality pet supplies and accessories.</p>
                
                <div className="image-gallery">
                    <img src={require('./assets/imagen1.jpg')} alt="Imagen 1" />
                </div>
                
                <h3>Our Mission</h3>
                <p>Our mission is to enhance the lives of pets and their owners by offering exceptional products, expert advice, and outstanding customer service. We believe that pets are family, and we strive to ensure that every pet has a happy and healthy life.</p>
                
                <div className="image-gallery">
                    <img src={require('./assets/imagen2.jpg')} alt="Imagen 2" />
                </div>

                <h3>What We Offer</h3>
                <ul>
                    <li><strong>Quality Products:</strong> We carefully select our products, ensuring they meet the highest standards of quality and safety. From premium pet food to fun toys and accessories, we have everything you need for your beloved pets.</li>
                    <li><strong>Expert Advice:</strong> Our knowledgeable staff is always ready to assist you with any questions or concerns about your pets. Whether you're a first-time pet owner or an experienced enthusiast, we are here to help!</li>
                    <li><strong>Grooming Services:</strong> Our professional grooming services are designed to pamper your pets and keep them looking their best. We use gentle, pet-friendly products to ensure a safe and enjoyable experience.</li>
                    <li><strong>Adoption Events:</strong> We believe in giving back to the community. That's why we regularly host adoption events to help connect pets in need with loving forever homes. Join us in making a difference!</li>
                </ul>

                <div className="image-gallery">
                    <img src={require('./assets/imagen3.jpg')} alt="Imagen 3" />
                </div>

                <h3>Our Team</h3>
                <p>Our dedicated team is made up of passionate pet lovers who understand the importance of quality care for pets. With years of experience in the pet industry, we are committed to providing you with the best service and advice possible.</p>

                <div className="image-gallery">
                    <img src={require('./assets/imagen4.jpg')} alt="Imagen 4" />
                </div>

                <h3>Community Involvement</h3>
                <p>We are proud to be a part of the local community and actively support various animal welfare organizations. Through fundraising events and partnerships, we work towards a better future for all pets.</p>

                <p>Thank you for choosing Michigan. We look forward to serving you and your pets for many years to come!</p>

                <h4>Contact Us</h4>
                <p>For more information about our products and services, please feel free to contact us:</p>
                <ul>
                    <li><strong>Email:</strong> humberto107_hotmail.com</li>
                    <li><strong>Phone:</strong> (123) 456-7890</li>
                    <li><strong>Address:</strong> 123 Pet Lane, Pet City, ST 12345</li>
                </ul>

                <div className="image-gallery">
                    <img src={require('./assets/imagen5.jpg')} alt="Imagen 5" />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AboutUs;
