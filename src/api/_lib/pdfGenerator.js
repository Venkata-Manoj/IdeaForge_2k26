// PDF Generator for Certificates
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { logo1Base64, logo2Base64, signatureBase64 } from './imageAssets.js';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 550;

const COLORS = {
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  darkBlue: rgb(0.051, 0.22, 0.502),
  mediumBlue: rgb(0.102, 0.298, 0.549),
  bodyText: rgb(0.149, 0.149, 0.149),
  goldBorder: rgb(0.722, 0.604, 0.102),
  lightGold: rgb(0.82, 0.722, 0.275),
};

export async function generateCertificate(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([CANVAS_WIDTH, CANVAS_HEIGHT]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // White background
  page.drawRectangle({
    x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT, color: COLORS.white,
  });

  // Outer border
  const outerBorder = 4;
  const outerPadding = 10;

  page.drawRectangle({
    x: 0,
    y: 0,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderWidth: outerBorder,
    borderColor: COLORS.goldBorder,
    color: COLORS.white,
  });

  // Inner border
  const innerX = outerPadding + outerBorder;
  const innerY = outerPadding + outerBorder;
  const innerWidth = CANVAS_WIDTH - 2 * (outerPadding + outerBorder);
  const innerHeight = CANVAS_HEIGHT - 2 * (outerPadding + outerBorder);

  page.drawRectangle({
    x: innerX,
    y: innerY,
    width: innerWidth,
    height: innerHeight,
    borderWidth: 1,
    borderColor: COLORS.lightGold,
    color: COLORS.white,
  });

  // Content area
  const contentTop = innerY + innerHeight - 36;

  // Logos
  const logoHeight = 70;
  const logosPaddingX = 20;

  // Left logo
  try {
    const logo1Bytes = Buffer.from(logo1Base64, 'base64');
    const logo1Image = await pdfDoc.embedPng(logo1Bytes);
    const scale1 = logoHeight / logo1Image.height;
    const logo1Width = logo1Image.width * scale1;

    page.drawImage(logo1Image, {
      x: innerX + logosPaddingX,
      y: contentTop - logoHeight,
      width: logo1Width,
      height: logoHeight,
    });
  } catch {
    // Logo failed to load
  }

  // Right logo
  try {
    const logo2Bytes = Buffer.from(logo2Base64, 'base64');
    const logo2Image = await pdfDoc.embedPng(logo2Bytes);
    const scale2 = logoHeight / logo2Image.height;
    const logo2Width = logo2Image.width * scale2;

    page.drawImage(logo2Image, {
      x: innerX + innerWidth - logosPaddingX - logo2Width,
      y: contentTop - logoHeight,
      width: logo2Width,
      height: logoHeight,
    });
  } catch {
    // Logo failed to load
  }

  // Titles
  const titlesY = contentTop - logoHeight - 24;

  const headerText = 'SIMATS ENGINEERING';
  const headerSize = 32;
  const headerWidth = boldFont.widthOfTextAtSize(headerText, headerSize);

  page.drawText(headerText, {
    x: CANVAS_WIDTH / 2 - headerWidth / 2,
    y: titlesY - headerSize,
    size: headerSize,
    font: boldFont,
    color: COLORS.darkBlue,
  });

  const subtitleText = 'CERTIFICATE OF PARTICIPATION';
  const subtitleSize = 18;
  const subtitleWidth = boldFont.widthOfTextAtSize(subtitleText, subtitleSize);

  page.drawText(subtitleText, {
    x: CANVAS_WIDTH / 2 - subtitleWidth / 2,
    y: titlesY - headerSize - 12 - subtitleSize,
    size: subtitleSize,
    font: boldFont,
    color: COLORS.mediumBlue,
  });

  // Decorative line
  const lineY = titlesY - headerSize - 12 - subtitleSize - 8 - 1;
  const lineWidth = innerWidth * 0.8;

  page.drawLine({
    start: { x: CANVAS_WIDTH / 2 - lineWidth / 2, y: lineY },
    end: { x: CANVAS_WIDTH / 2 + lineWidth / 2, y: lineY },
    thickness: 1,
    color: COLORS.lightGold,
  });

  // Body text
  const bodyY = lineY - 28;
  const participantName = data.participantName || 'Participant';
  const eventType = data.eventType || 'Technical';
  const bodySize = 15;
  const bodyLineHeight = 30;
  const bodyMaxWidth = 620;

  const bodyText = `This is to certify that ${participantName} has actively participated in the "IDEAFORGE 2K26" organized by "SIMATS Engineering Passion Pitch Club" as a contributor in the ${eventType} activity. Your innovation and initiative reflect the spirit of building ideas that shape the future.`;

  // Wrap text
  const words = bodyText.split(' ');
  let lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, bodySize);

    if (testWidth > bodyMaxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const bodyX = CANVAS_WIDTH / 2 - bodyMaxWidth / 2;
  let currentBodyY = bodyY - bodySize;

  for (const line of lines) {
    page.drawText(line, {
      x: bodyX,
      y: currentBodyY,
      size: bodySize,
      font: font,
      color: COLORS.bodyText,
    });
    currentBodyY -= bodyLineHeight;
  }

  // Bottom section
  const bottomTextSize = 13;
  const bottomPaddingY = 28 + 20;

  const dateVenueY = innerY + bottomPaddingY + bottomTextSize;
  const dateVenueX = innerX + logosPaddingX;

  page.drawText('Date:', {
    x: dateVenueX,
    y: dateVenueY + 4 + bottomTextSize,
    size: bottomTextSize,
    font: boldFont,
    color: COLORS.bodyText,
  });
  page.drawText(' 20/03/26', {
    x: dateVenueX + boldFont.widthOfTextAtSize('Date:', bottomTextSize),
    y: dateVenueY + 4 + bottomTextSize,
    size: bottomTextSize,
    font: font,
    color: COLORS.bodyText,
  });

  page.drawText('Venue:', {
    x: dateVenueX,
    y: dateVenueY,
    size: bottomTextSize,
    font: boldFont,
    color: COLORS.bodyText,
  });
  page.drawText(' SIMATS ENGINEERING', {
    x: dateVenueX + boldFont.widthOfTextAtSize('Venue:', bottomTextSize),
    y: dateVenueY,
    size: bottomTextSize,
    font: font,
    color: COLORS.bodyText,
  });

  // Signature section
  const sigMinWidth = 200;
  const sigLineWidth = 160;
  const sigCenterX = innerX + innerWidth - logosPaddingX - sigMinWidth / 2;

  const hodText = 'Head of the Department';
  const hodWidth = italicFont.widthOfTextAtSize(hodText, bottomTextSize);

  page.drawText(hodText, {
    x: sigCenterX - hodWidth / 2,
    y: dateVenueY,
    size: bottomTextSize,
    font: italicFont,
    color: COLORS.bodyText,
  });

  const sigLineY = dateVenueY + 6 + 1;

  page.drawLine({
    start: { x: sigCenterX - sigLineWidth / 2, y: sigLineY },
    end: { x: sigCenterX + sigLineWidth / 2, y: sigLineY },
    thickness: 1,
    color: COLORS.bodyText,
  });

  try {
    const sigBytes = Buffer.from(signatureBase64, 'base64');
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const sigTargetWidth = 160;
    const sigScale = sigTargetWidth / sigImage.width;
    const sigActualHeight = sigImage.height * sigScale;

    page.drawImage(sigImage, {
      x: sigCenterX - sigTargetWidth / 2 + 20,
      y: sigLineY + 2,
      width: sigTargetWidth,
      height: sigActualHeight,
    });
  } catch {
    // Signature failed to load
  }

  return await pdfDoc.save();
}
