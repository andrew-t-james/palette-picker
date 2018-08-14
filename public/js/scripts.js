
const getRandomHexColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 16777215 = #ffffff;
const setColorPallet = async () => {
  const response = await fetch('/api/v1/pallet');
  const pallet = await response.json();
  console.log(pallet);
};
setColorPallet();