import swiftImage from "@/assets/swift.jpg";
import cretaImage from "@/assets/creta.jpg";
import cityImage from "@/assets/city.jpg";
import innovaImage from "@/assets/innova.jpg";
import altoImage from "@/assets/alto.jpg";
import tharImage from "@/assets/thar.jpg";
import gurkhaImage from "@/assets/gurkha.jpg";
import jimnyImage from "@/assets/jimny.jpg";
import himalayanImage from "@/assets/himalayan.jpg";
import himalayan411Image from "@/assets/himalayan411.jpg";
import adv390Image from "@/assets/adv390.jpg";
import classic350Image from "@/assets/classic350.jpg";
import pulsar150Image from "@/assets/pulsar150.jpg";
import activaImage from "@/assets/activa.jpg";
import roninImage from "@/assets/ronin.jpg";
import scorpioImage from "@/assets/scorpio.jpg";
import fortunerImage from "@/assets/fortuner.jpg";
import ninjaImage from "@/assets/ninja.jpg";
import cbr1000rrImage from "@/assets/cbr1000rr.jpg";
import streetTripleImage from "@/assets/street_triple.jpg";
import z900Image from "@/assets/z900.jpg";
import guerrillaImage from "@/assets/guerrilla.jpg";
import speed400Image from "@/assets/speed400.png";
import scramblerImage from "@/assets/scrambler.png";
import hiluxImage from "@/assets/hilux.jpg";

export function getVehicleImage(make, model, type) {
  const m = (model || '').toLowerCase();
  
  // Explicit matches for the user's requested bikes
  if (m.includes('411')) return himalayan411Image;
  if (m.includes('450') && m.includes('himalayan')) return himalayanImage;
  if (m.includes('cbr')) return cbr1000rrImage;
  if (m.includes('z900')) return z900Image;
  if (m.includes('street')) return streetTripleImage;
  if (m.includes('guerrilla')) return guerrillaImage;
  if (m.includes('speed')) return speed400Image;
  if (m.includes('scrambler')) return scramblerImage;

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
  if (m.includes('hilux')) return hiluxImage;

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
