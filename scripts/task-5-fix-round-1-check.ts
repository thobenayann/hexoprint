import { ContactFormAdminEmail } from '../src/components/emails/contact-form-admin-email';
import { ContactFormConfirmationEmail } from '../src/components/emails/contact-form-confirmation-email';
import {
    ContactFormSchema,
    EmailResponseSchema,
} from '../src/lib/email-schemas';
import { validateFile } from '../src/lib/file-upload';
import assert from 'node:assert/strict';
import { render } from 'react-email';

async function main() {
    const rawFormData = {
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@example.com',
        projectType: 'prototypage',
        description: 'Pièce de test',
        files: [],
    };

    const missingType = ContactFormSchema.safeParse(rawFormData);
    assert.equal(missingType.success, false);
    if (missingType.success) {
        throw new Error('Le type manquant aurait dû être rejeté');
    }
    assert.equal(
        missingType.error.issues[0]?.message,
        'Le type de client est requis'
    );

    const invalidType = ContactFormSchema.safeParse({
        ...rawFormData,
        type: 'association',
    });
    assert.equal(invalidType.success, false);
    if (invalidType.success) {
        throw new Error('Le type invalide aurait dû être rejeté');
    }
    assert.equal(
        invalidType.error.issues[0]?.message,
        "Invalid enum value. Expected 'particulier' | 'professionnel', received 'association'"
    );

    const formData = ContactFormSchema.parse({
        ...rawFormData,
        type: 'particulier',
    });
    const submittedAt = '2 août 2026 à 10:00';
    const adminHtml = await render(
        ContactFormAdminEmail({ formData, submittedAt })
    );
    const confirmationHtml = await render(
        ContactFormConfirmationEmail({ formData, submittedAt })
    );
    assert.equal(adminHtml.includes('Alice Martin'), true);
    assert.equal(adminHtml.includes('Pièce de test'), true);
    assert.equal(confirmationHtml.includes('Alice'), true);
    assert.equal(confirmationHtml.includes('Pièce de test'), true);

    const missingCompany = ContactFormSchema.safeParse({
        ...formData,
        type: 'professionnel',
    });
    assert.equal(missingCompany.success, false);
    if (missingCompany.success) {
        throw new Error("L'entreprise manquante aurait dû être rejetée");
    }
    assert.equal(missingCompany.error.issues[0]?.path.join('.'), 'company');

    EmailResponseSchema.parse({ success: true, message: 'ok' });
    const upload = validateFile(
        new File(['solid'], 'piece.stl', { type: 'model/stl' })
    );
    assert.deepEqual(upload, { valid: true, category: '3d' });

    console.log(
        JSON.stringify({
            missingTypeMessage: missingType.error.issues[0]?.message,
            invalidTypeMessage: invalidType.error.issues[0]?.message,
            adminHtmlLength: adminHtml.length,
            confirmationHtmlLength: confirmationHtml.length,
            schemaChecks: 4,
            uploadCategory: upload.category,
        })
    );
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
