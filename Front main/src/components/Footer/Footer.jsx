import './Footer.scss';
import cityscape from '../../assets/images/cityscape.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h2 className="footer-title">Términos y condiciones</h2>
          <p className="footer-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
        <div className="footer-right">
          <img src={cityscape} alt="cityscape" />
          <div className="footer-bottom">
            <div className="contact-info">
              <span className="phone">+57 300 8844</span>
              <span className="email">example@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
