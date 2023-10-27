import { createCanvas } from "canvas";

const generateDefaultAvatar = async (firstName) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");

  // Define background colors
  const backgroundColors = [
    "#ED0010",
    "#3498db",
    "#27ae60",
    "#f39c12",
    "#8e44ad",
  ];

  // Randomly select background color
  const randomColor =
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];  

    // Set background color
    ctx.fillStyle = randomColor;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // Draw centered text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px Sans";
    ctx.textAlign = "center";
    ctx.fillText(
        firstName.charAt(0).toUpperCase(),
        canvas.width / 2,
        canvas.height / 2 + 16
    );

    // Create canvas to image buffer
    return canvas.toBuffer();

};

export default generateDefaultAvatar;
