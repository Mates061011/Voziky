import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import arrowIconUrl from '../../assets/PlusButton.svg';
import arrowDownIconUrl from '../../assets/MinusButton.svg';

// Styled Accordion (remove border)
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: 'none',
  '&:not(:last-child)': {
    borderBottom: 'none',
  },
  '&::before': {
    display: 'none',
  },
  width: '90%',
  textAlign: 'left',
  fontWeight: '700',
  backgroundColor: 'transparent',
}));

// Styled AccordionSummary (remove border)
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<img src={arrowIconUrl} alt="Expand Icon" style={{ width: '30px', height: '30px' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'none',
  flexDirection: 'row',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

// Styled AccordionDetails (remove border)
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: 'none',
  backgroundColor: 'none',
  paddingLeft: '30px',
}));

const Faq = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [data, setData] = React.useState<{ question: string; answer: string }[]>([]);
  
    React.useEffect(() => {
      // Fetch JSON data
      fetch('/faq.json')
        .then((response) => response.json())
        .then((data) => setData(data));
    }, []);
  
    const handleChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
    
    return (
      <div className='qaaCont'>
        {data.map((item, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              aria-controls={`panel${index}d-content`}
              id={`panel${index}d-header`}
              expandIcon={
                <img
                  src={expanded === `panel${index}` ? arrowDownIconUrl : arrowIconUrl}
                  alt="Expand Icon"
                  style={{ width: '20px', height: '20px' }}
                />
              }
            >
              <Typography style={{ fontWeight: '500' }}>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{color: "#818181"}}>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  };
  
export default Faq;
  