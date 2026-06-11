import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authUser/hooks/useAuth';

const Navbar = () => {
  const { logoutHook, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutHook();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/groups" className="navbar__logo" onClick={() => setIsOpen(false)}>
          Split<span>Ease</span>
        </Link>

        
        
        <button 
          className={`navbar__toggle ${isOpen ? 'navbar__toggle--open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`navbar__menu ${isOpen ? 'navbar__menu--open' : ''}`}>
          <div className="navbar__item">
            <Link 
              to="/groups" 
              className="navbar__link"
              onClick={() => setIsOpen(false)}
            >
              My Groups
            </Link>
          </div>
          
          {user && (
            <div className="navbar__item">
              <span className="navbar__user" onClick={() => navigate('/profile')}>
                {user.name || user.username || 'User'}
              </span>
            </div>
          )}
          
          <div className="navbar__item">
            <button onClick={handleLogout} className="navbar__logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar };
