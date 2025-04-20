import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar, Nav, Container } from 'react-bootstrap';
import NotificationBell from '../notifications/NotificationBell';

function NavBar() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to="/"><img src={`${process.env.PUBLIC_URL}/ConnectWise.png`} alt="ConnectWise" width="100px" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/create-post">Create Post</Nav.Link>
                <Nav.Link as={NavLink} to="/explore">Explore</Nav.Link>
                <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/messages">Messages</Nav.Link>
                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                {user?.role === 'admin' && (
                  <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>
                )}
              </Nav>
              <Nav className="ms-auto">
                <NotificationBell />
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;