// src/pages/CookiesPolicy.tsx
import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const CookiesPolicy: React.FC = () => {
  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '800px',
        textAlign: 'left',    // ensure all text is flush left
        margin: '0 auto',
      }}
    >
      <Title level={1} style={{ textAlign: 'left' }}>
        Zásady používání cookies
      </Title>

      <Paragraph>
        Tento dokument popisuje, jak naše webové stránky používají soubory cookies a jak můžete spravovat svá nastavení.
      </Paragraph>

      <Title level={2}>1. Co jsou cookies?</Title>
      <Paragraph>
        Cookies jsou malé textové soubory, které se uloží do vašeho zařízení (počítače, telefonu nebo tabletu), když navštívíte web. Cookies nám pomáhají rozpoznat vaše zařízení a zapamatovat si vaše preference (např. jazyk nebo přihlášení), abychom zlepšili vaše další prohlížení.
      </Paragraph>

      <Title level={2}>2. Jaké typy cookies používáme?</Title>
      <Paragraph>
        <Text strong>Nezbytné cookies:</Text>  
        Tyto cookies zajišťují základní funkce webu, jako je navigace na stránce, přihlášení nebo naplnění nákupního košíku. Bez nich by stránka nemohla správně fungovat.
      </Paragraph>
      <Paragraph>
        <Text strong>Analytické cookies:</Text>  
        Pomáhají nám pochopit, jak návštěvníci interagují s naším webem (které stránky nejčastěji navštěvují, jak dlouho zde zůstávají apod.). Tyto informace nám umožňují vylepšovat obsah a strukturu stránek.
      </Paragraph>

      <Title level={2}>3. Správa cookies</Title>
      <Paragraph>
        Při první návštěvě vám zobrazíme dialog pro výběr cookies, kde můžete povolit či zakázat analytické cookies. Vaše volba se uloží a při dalších návštěvách se dialog již neobjeví.  
        Pokud chcete své nastavení změnit, klikněte na ikonu cookies v pravém dolním rohu stránky.
      </Paragraph>

      <Title level={2}>4. Změny zásad</Title>
      <Paragraph>
        Tyto zásady můžeme čas od času aktualizovat. Datum poslední revize najdete vždy v hlavičce této stránky.
      </Paragraph>

      <Title level={2}>5. Kontakt</Title>
      <Paragraph>
        Máte‑li dotazy týkající se používání cookies na tomto webu, napište nám na{' '}
        <a href="mailto:privacy@vasedomena.cz">privacy@vasedomena.cz</a>.
      </Paragraph>
    </div>
  );
};

export default CookiesPolicy;
