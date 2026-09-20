import swiftImage from "@/assets/swift.jpg";
import cretaImage from "@/assets/creta.jpg";
import cityImage from "@/assets/city.jpg";
import innovaImage from "@/assets/innova.jpg";
import altoImage from "@/assets/alto.jpg";
import tharImage from "@/assets/thar.jpg";
import gurkhaImage from "@/assets/gurkha.jpg";
import jimnyImage from "@/assets/jimny.jpg";
import himalayanImage from "@/assets/himalayan.jpg";
import adv390Image from "@/assets/adv390.jpg";

export function getVehicleImage(make, model, type) {
  const m = (model || '').toLowerCase();
  if (m.includes('swift')) return swiftImage;
  if (m.includes('creta')) return cretaImage;
  if (m.includes('city')) return cityImage;
  if (m.includes('innova')) return innovaImage;
  if (m.includes('alto')) return altoImage;
  if (m.includes('thar')) return tharImage;
  if (m.includes('gurkha')) return gurkhaImage;
  if (m.includes('jimny')) return jimnyImage;
  if (m.includes('himalayan')) return himalayanImage;
  if (m.includes('adv') || m.includes('390')) return adv390Image;
  return type === 'bike' ? himalayanImage : cityImage;
}
