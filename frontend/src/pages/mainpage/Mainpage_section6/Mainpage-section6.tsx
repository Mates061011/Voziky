import { Container, Grid, Typography } from '@mui/material';
import "./mainpage-section6.css";
import Faq from '../../../components/faq/Faq';
import ContactForm from '../../../components/faq/Faq-form';

const Section6 = () => (
  <Container>
    <h4>FAQ</h4>
    <Typography
      variant="h3"
      gutterBottom
      sx={{
        fontWeight: 700,
        fontSize: {
          xs: '1.5rem',
          sm: '2rem',
          md: '3rem',
        }
      }}
    >
      Často kladené dotazy
    </Typography>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={6} className='questions'>
        <Faq/>
      </Grid>
      <Grid item xs={12} sm={6} className='qaa-form'>
        <ContactForm/>
      </Grid>
    </Grid>
  </Container>
);
export default Section6;