import type { ContactFormData } from '@/lib/email-schemas';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from '@react-email/components';

type ContactFormConfirmationEmailProps = {
    formData: ContactFormData;
    submittedAt: string;
    baseUrl: string;
};

export function ContactFormConfirmationEmail({
    formData,
    submittedAt,
    baseUrl,
}: ContactFormConfirmationEmailProps) {
    const { firstName, lastName, projectType, description } = formData;

    return (
        <Html>
            <Head />
            <Preview>
                Confirmation de votre demande de devis - Hexo&apos;print
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo Hexo'print */}
                    <Section style={logoSection}>
                        <Img
                            src={`${baseUrl}/logos/hexo_print_logo-250px.png`}
                            alt="Hexo'print - Impression 3D"
                            width='120'
                            height='120'
                            style={logo}
                        />
                    </Section>

                    <Heading style={h1}>Merci pour votre demande !</Heading>

                    <Text style={text}>
                        Bonjour {firstName} {lastName},
                    </Text>

                    <Text style={text}>
                        Nous avons bien reçu votre demande de devis pour votre
                        projet d&apos;impression 3D. Chez Hexo&apos;print,
                        chaque demande est importante et nous prenons le temps
                        d&apos;analyser votre projet avec soin.
                    </Text>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Heading as='h2' style={h2}>
                            Récapitulatif de votre demande
                        </Heading>
                        <Text style={text}>
                            <strong>Type de projet :</strong>{' '}
                            {getProjectTypeLabel(projectType)}
                        </Text>
                        <Text style={text}>
                            <strong>Description :</strong>
                        </Text>
                        <Section style={descriptionBox}>
                            <Text style={descriptionText}>{description}</Text>
                        </Section>
                        <Text style={text}>
                            <strong>Demande reçue le :</strong> {submittedAt}
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Heading as='h2' style={h2}>
                            Prochaines étapes
                        </Heading>
                        <Text style={text}>
                            <strong>1. Analyse de votre projet</strong>
                            <br />
                            Notre équipe étudie votre demande et les fichiers
                            joints pour comprendre vos besoins techniques.
                        </Text>
                        <Text style={text}>
                            <strong>2. Préparation du devis</strong>
                            <br />
                            Nous calculons le coût, les matériaux nécessaires et
                            les délais de réalisation.
                        </Text>
                        <Text style={text}>
                            <strong>
                                3. Envoi de votre devis personnalisé
                            </strong>
                            <br />
                            Vous recevrez un devis détaillé sous 24-48h (jours
                            ouvrés).
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Text style={text}>
                            <strong>Temps de réponse :</strong> Nous nous
                            engageons à vous répondre sous 24 à 48 heures (jours
                            ouvrés).
                        </Text>
                        <Text style={text}>
                            <strong>Une question ?</strong> N&apos;hésitez pas à
                            nous contacter à contact@hexoprint.fr ou répondez
                            directement à cet email.
                        </Text>
                    </Section>

                    <Section style={buttonSection}>
                        <Button style={button} href='https://hexoprint.fr'>
                            Visiter notre site
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    <Text style={signature}>
                        Cordialement,
                        <br />
                        <strong>Yann de l&apos;équipe Hexo&apos;print</strong>
                        <br />
                        Votre spécialiste en impression 3D artisanale
                    </Text>

                    <Text style={footer}>
                        Hexo&apos;print - Impression 3D sur-mesure
                        <br />
                        Seysses, Haute-Garonne
                        <br />
                        contact@hexoprint.fr
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Fonction utilitaire pour les labels de projets
function getProjectTypeLabel(projectType: string): string {
    const labels: Record<string, string> = {
        prototypage: 'Prototypage rapide',
        reparation: 'Réparation de pièce',
        modelisme: 'Modélisme',
        decoration: 'Objet décoratif',
        'piece-technique': 'Pièce technique sur-mesure',
        'petite-serie': 'Petite série',
        autre: 'Autre projet',
    };
    return labels[projectType] || projectType;
}

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '0 5px 10px rgba(20,50,70,.2)',
    marginTop: '20px',
    maxWidth: '600px',
    padding: '20px',
};

const h1 = {
    color: '#24556A',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
};

const h2 = {
    color: '#24556A',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '20px 0 10px 0',
};

const text = {
    color: '#333',
    fontSize: '14px',
    margin: '10px 0',
    lineHeight: '1.5',
};

const descriptionBox = {
    margin: '10px 0',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #96CFE7',
    borderRadius: '4px',
};

const descriptionText = {
    color: '#333',
    fontSize: '14px',
    fontStyle: 'italic' as const,
    margin: '0',
};

const section = {
    margin: '20px 0',
};

const buttonSection = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#24556A',
    borderRadius: '5px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const hr = {
    borderColor: '#E9E9E9',
    margin: '20px 0',
};

const signature = {
    color: '#333',
    fontSize: '14px',
    margin: '20px 0',
    lineHeight: '1.5',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    margin: '20px 0',
    textAlign: 'center' as const,
    lineHeight: '1.5',
};

const logoSection = {
    textAlign: 'center' as const,
    margin: '20px 0',
};

const logo = {
    borderRadius: '5px',
    width: '120px',
    height: '120px',
};
