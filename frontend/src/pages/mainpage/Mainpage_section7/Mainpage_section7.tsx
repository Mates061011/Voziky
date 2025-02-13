import { useState } from 'react';
import './mainpage_section7.css';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import NaVetviLogo from '../../../assets/NaVetviLogo.svg';

const Section7 = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Container className="section7">
      <Grid container spacing={{ xs: 2, sm: 5 }}>
        {/* First Grid Item */}
        <Grid item xs={12} sm={6} md={7}>
          <div className="gridWrap">
            <h4>NAŠE TIPY NA VÝLETY PO OKOLÍ</h4>
            <h3>Park Na větvi</h3>
            <span className={`para ${isExpanded ? 'paraExpanded' : ''}`}>
              Park Na větvi tvoří unikátní soustava tří síťových hřišť zavěšených v korunách stromů propojených s 3D bludištěm, které je složeno ze síťových překážkových drah rozprostřených ve třech patrech nad sebou. Síťové bludiště v korunách stromů obsahuje mnoho zábavných prvků, které otestují vaše motorické dovednosti. Jednotlivé herní plochy jsou propojeny visutými lávkami. Celá atrakce vrcholí sjezdem unikátním tobogánem z výšky necelých 10 m. Pohybová atrakce je natolik bezpečná, že na rozdíl od klasických lanových center nevyžaduje žádné osobní lanové jištění. <br />
              Součástí areálu je plně vybavený stánek s občerstvením, ve kterém se mohou občerstvit malí dobrodruzi i čekající doprovod. Nabízí se zde regionální speciality od místních dodavatelů a o víkendech se před stánkem grilují sezónní dobroty.

              <span className="readMoreText" onClick={toggleText}>
                {isExpanded ? 'Zobrazit méně' : 'Zobrazit více'}
              </span>
            </span>
            <div style={{ marginTop: '40px' }}>
              <p><b>vzdálenost od půjčovny:</b> 2km</p>
              <p><b>vhodné pro:</b> pěší, cyklisty, in-line, bruslaře, běžce</p>
              <p><b>web:</b> www.parknavetvi.cz</p>
            </div>
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          sx={{
            display: { xs: 'flex', sm: 'block' },
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Grid item xs={12} sm={4} className="imgWrap">
            <img src={NaVetviLogo} alt="Logo Na Vetvi" className="NaVetviPic" />
          </Grid>
          <Grid item xs={12} sm={8} className="imgWrap"
          sx={{
            display: { xs: 'flex', sm: 'block' },
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div className="imgWrap2"></div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Section7;
