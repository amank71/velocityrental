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
  
  // Custom external images for the latest bikes
  if (m.includes('cbr')) return "https://images.unsplash.com/photo-1568772585407-9361f9bf3c87?auto=format&fit=crop&w=800&q=80";
  if (m.includes('z900') || m.includes('street')) return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80";
  if (m.includes('speed')) return "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80";
  if (m.includes('scrambler') || m.includes('guerrilla')) return "https://images.unsplash.com/photo-1552308995-2baac1ad5490?auto=format&fit=crop&w=800&q=80";

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
  if (m.includes('himalayan')) return himalayanImage;
  if (m.includes('adv') || m.includes('390')) return adv390Image;
  if (m.includes('classic')) return classic350Image;
  if (m.includes('pulsar')) return pulsar150Image;
  if (m.includes('activa')) return activaImage;
  if (m.includes('ronin')) return roninImage;
  if (m.includes('ninja')) return ninjaImage;

  // Fallbacks
  return type === 'bike' ? pulsar150Image : cityImage;
}
