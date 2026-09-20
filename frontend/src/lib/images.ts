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
import classic350Image from "@/assets/classic350.jpg";
import pulsar150Image from "@/assets/pulsar150.jpg";
import activaImage from "@/assets/activa.jpg";
import roninImage from "@/assets/ronin.jpg";
import scorpioImage from "@/assets/scorpio.jpg";
import fortunerImage from "@/assets/fortuner.jpg";
import ninjaImage from "@/assets/ninja.jpg";

export function getVehicleImage(make, model, type) {
  const m = (model || '').toLowerCase();
  
  // Cars
  if (m.includes('swift')) return swiftImage;
  if (m.includes('creta')) return cretaImage;
  if (m.includes('city')) return cityImage;
  if (m.includes('innova')) return innovaImage;
  if (m.includes('alto')) return altoImage;
  if (m.includes('thar')) return tharImage;
  if (m.includes('gurkha')) return gurkhaImage;
  if (m.includes('jimny')) return jimnyImage;
  if (m.includes('scorpio')) return scorpioImage;
  if (m.includes('fortuner')) return fortunerImage;

  // Bikes & Scooters
  if (m.includes('himalayan') || m.includes('scrambler')) return himalayanImage;
  if (m.includes('adv') || m.includes('390')) return adv390Image;
  if (m.includes('classic') || m.includes('speed')) return classic350Image;
  if (m.includes('pulsar')) return pulsar150Image;
  if (m.includes('activa')) return activaImage;
  if (m.includes('ronin') || m.includes('guerrilla')) return roninImage;
  if (m.includes('ninja') || m.includes('cbr') || m.includes('z900') || m.includes('street')) return ninjaImage;

  // Fallbacks
  return type === 'bike' ? pulsar150Image : cityImage;
}
