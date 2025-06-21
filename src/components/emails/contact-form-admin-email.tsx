import type { ContactFormData } from '@/lib/email-schemas';
import {
    Body,
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

type ContactFormAdminEmailProps = {
    formData: ContactFormData;
    submittedAt: string;
    baseUrl: string;
};

export function ContactFormAdminEmail({
    formData,
    submittedAt,
    baseUrl,
}: ContactFormAdminEmailProps) {
    const {
        type,
        firstName,
        lastName,
        email,
        phone,
        company,
        projectType,
        description,
        budget,
        deadline,
        files,
    } = formData;

    return (
        <Html>
            <Head />
            <Preview>
                Nouvelle demande de devis de {firstName} {lastName}
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

                    <Heading style={h1}>Nouvelle demande de devis</Heading>

                    <Text style={text}>
                        Une nouvelle demande de devis a été reçue sur le site
                        Hexo&apos;print.
                    </Text>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Heading as='h2' style={h2}>
                            Informations du contact
                        </Heading>
                        <Text style={text}>
                            <strong>Type :</strong>{' '}
                            {type === 'particulier'
                                ? 'Particulier'
                                : 'Professionnel'}
                        </Text>
                        <Text style={text}>
                            <strong>Nom :</strong> {firstName} {lastName}
                        </Text>
                        <Text style={text}>
                            <strong>Email :</strong> {email}
                        </Text>
                        {phone && (
                            <Text style={text}>
                                <strong>Téléphone :</strong> {phone}
                            </Text>
                        )}
                        {company && (
                            <Text style={text}>
                                <strong>Entreprise :</strong> {company}
                            </Text>
                        )}
                    </Section>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Heading as='h2' style={h2}>
                            Détails du projet
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
                        {budget && (
                            <Text style={text}>
                                <strong>Budget approximatif :</strong>{' '}
                                {getBudgetLabel(budget)}
                            </Text>
                        )}
                        {deadline && (
                            <Text style={text}>
                                <strong>Délai souhaité :</strong>{' '}
                                {getDeadlineLabel(deadline)}
                            </Text>
                        )}
                    </Section>

                    {files && files.length > 0 && (
                        <>
                            <Hr style={hr} />
                            <Section style={section}>
                                <Heading as='h2' style={h2}>
                                    Fichiers joints ({files.length})
                                </Heading>
                                {files.map((file, index) => (
                                    <Text key={index} style={text}>
                                        • {file.name} (
                                        {(file.size / 1024 / 1024).toFixed(2)}{' '}
                                        MB)
                                    </Text>
                                ))}
                            </Section>
                        </>
                    )}

                    <Hr style={hr} />

                    <Text style={footer}>Demande reçue le {submittedAt}</Text>
                </Container>
            </Body>
        </Html>
    );
}

// Fonctions utilitaires pour les labels
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

function getBudgetLabel(budget: string): string {
    const labels: Record<string, string> = {
        '0-50': 'Moins de 50€',
        '50-100': '50€ - 100€',
        '100-200': '100€ - 200€',
        '200-500': '200€ - 500€',
        '500+': 'Plus de 500€',
    };
    return labels[budget] || budget;
}

function getDeadlineLabel(deadline: string): string {
    const labels: Record<string, string> = {
        urgent: 'Urgent (48h)',
        '1-semaine': 'Sous 1 semaine',
        '2-semaines': 'Sous 2 semaines',
        '1-mois': 'Sous 1 mois',
        flexible: 'Flexible',
    };
    return labels[deadline] || deadline;
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

const hr = {
    borderColor: '#E9E9E9',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    margin: '10px 0',
    textAlign: 'center' as const,
};

const logoSection = {
    textAlign: 'center' as const,
    marginBottom: '20px',
};

const logo = {
    width: '120px',
    height: '120px',
    objectFit: 'contain' as const,
};
