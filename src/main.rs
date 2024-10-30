use image::{DynamicImage, GenericImageView, RgbaImage};
use image::{GrayImage, Luma};
use std::env;
use std::path::{Path, PathBuf};

fn slice(
    img: &DynamicImage,
    rough_height: u32,
    threshold: u8,
    skip_step: u8,
    neighbor_count: usize,
    absolute_height: bool,
) -> Vec<RgbaImage> {
    let (width, height) = img.dimensions();
    let mut images = Vec::new();

    if rough_height > height {
        images.push(img.to_rgba8());
        return images;
    }

    if absolute_height {
        for i in 0..(height / rough_height) {
            let out_img = img.crop_imm(0, i * rough_height, width, rough_height);
            images.push(out_img.to_rgba8());
        }
        return images;
    } else {
        let mut skip = false;
        let mut prev_step: u32 = 0;
        let mut col: u32 = rough_height;

        let gray_img: GrayImage = img.to_luma8();

        while prev_step < height {
            let mut pixels: Vec<u8> = Vec::with_capacity(width as usize);
            for x in 0..width {
                let pixel: Luma<u8> = *gray_img.get_pixel(x, col as u32);
                pixels.push(pixel[0]);
            }

            for r in neighbor_count..pixels.len() {
                let slice = &pixels[r - (neighbor_count as usize)..r];
                let diff = *slice.iter().max().unwrap() - *slice.iter().min().unwrap();

                if diff > threshold {
                    col += skip_step as u32;
                    skip = true;
                    break;
                }
            }

            if skip && col < height {
                skip = false;
                continue;
            }

            let h: u32 =
                if height < rough_height / 4 + col || col > height || rough_height + col > height {
                    height
                } else {
                    col
                };

            let out_img = img.crop_imm(0, prev_step as u32, width, (h - prev_step) as u32);
            images.push(out_img.to_rgba8());

            prev_step = h;
            col += rough_height;
        }

        return images;
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 8 {
        eprintln!("Usage: {} <image_path> <rough_height> <threshold> <skip_step> <neighbor_count> <output path> <absolute_height>", args[0]);
        std::process::exit(1);
    }

    // Parse the arguments
    let image_path = PathBuf::from(&args[1]);
    let rough_height: u32 = args[2].parse().expect("Invalid rough_height");
    let threshold: u8 = args[3].parse().expect("Invalid threshold");
    let skip_step: u8 = args[4].parse().expect("Invalid skip_step");
    let neighbor_count: usize = args[5].parse().expect("Invalid neighbor_count");
    let output_path = PathBuf::from(&args[6]);
    let absolute_height: bool = args[7]
        .parse()
        .expect("Invalid absolute_height (must be true or false)");

    let img = image::open(image_path).expect("Failed to open image");

    let images = slice(
        &img,
        rough_height,
        threshold,
        skip_step,
        neighbor_count,
        absolute_height,
    );

    let full_path = output_path
        .canonicalize()
        .expect("Failed to get full path")
        .to_string_lossy()
        .into_owned();

    for (i, img) in images.iter().enumerate() {
        img.save(Path::new(&full_path).join(format!("{}.png", i)))
            .unwrap();
        println!("{}.png Saved", i);
    }
}
