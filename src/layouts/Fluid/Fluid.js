import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import NoSsr from '@mui/material/NoSsr';

import Container from 'components/Container';
import { Topbar, Sidebar, Footer, ThemeModeToggler } from './components';

import pages from '../navigation';

const Fluid = ({
  children,
  colorInvert = false,
  bgcolor = 'alternate.main',
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const open = isMd ? false : openSidebar;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollTo = (id) => {
    setTimeout(() => {
      const element = document.querySelector(`#${id}`);
      if (!element) {
        return;
      }

      window.scrollTo({ left: 0, top: element.offsetTop, behavior: 'smooth' });
    });
  };

  return (
    <Box id="js--fluid-top">
      <AppBar
        position={'relative'}
        sx={{
          top: 0,
          backgroundColor: bgcolor,
        }}
        elevation={0}
      >
        <Container
          maxWidth={1500}
          paddingTop={'8px !important'}
          paddingBottom={'0 !important'}
        >
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
          >
            <Box marginRight={2}>
              <Link
                underline="none"
                component="a"
                href="/blocks"
                color={colorInvert ? 'common.white' : 'text.primary'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                Components
                <Box
                  padding={0.5}
                  display={'inline-flex'}
                  borderRadius={1}
                  bgcolor={'primary.main'}
                  marginLeft={1}
                >
                  <Typography
                    variant={'caption'}
                    sx={{ color: 'common.white', lineHeight: 1 }}
                  >
                    new
                  </Typography>
                </Box>
              </Link>
            </Box>
            <Box marginRight={2}>
              <Link
                underline="none"
                component="a"
                href="/docs/introduction"
                color={colorInvert ? 'common.white' : 'text.primary'}
              >
                Docs
              </Link>
            </Box>
            <Box>
              <ThemeModeToggler />
            </Box>
          </Box>
        </Container>
        <Container paddingY={1} maxWidth={1500}>
          <Topbar
            onSidebarOpen={handleSidebarOpen}
            pages={pages}
            colorInvert={trigger ? false : colorInvert}
          />
        </Container>
      </AppBar>
      <Sidebar
        onClose={handleSidebarClose}
        open={open}
        variant="temporary"
        pages={pages}
      />
      <main>
        {children}
        <Divider />
      </main>
      <Container paddingY={4}>
        <Footer />
      </Container>
      <NoSsr>
        <Zoom in={trigger}>
          <Box
            onClick={() => scrollTo('js--fluid-top')}
            role="presentation"
            sx={{ position: 'fixed', bottom: 24, right: 32 }}
          >
            <Fab color="primary" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </Box>
        </Zoom>
      </NoSsr>
    </Box>
  );
};

Fluid.propTypes = {
  children: PropTypes.node,
  colorInvert: PropTypes.bool,
  bgcolor: PropTypes.string,
};

export default Fluid;
