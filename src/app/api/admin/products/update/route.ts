import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdminEmail } from '@/lib/adminAuth';
import { validateSession } from '@/lib/admin';
import { getAdminSanityClient } from '@/sanity/lib/adminClient';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin authentication
    const session = await auth();
    let isAuthorized = false;

    if (session?.user?.email && isAdminEmail(session.user.email)) {
      isAuthorized = true;
    } else if ((session?.user as any)?.role === 'admin') {
      isAuthorized = true;
    } else {
      // Fallback: check admin_token cookie
      const adminCookie = req.cookies.get('admin_token')?.value;
      if (adminCookie) {
        const validated = validateSession(adminCookie);
        if (validated.valid) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required.' },
        { status: 401 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let productId = '';
    let title: string | undefined;
    let description: string | undefined;
    let price: number | undefined;
    let inStock: boolean | undefined;
    let brand: string | undefined;
    let color: string | undefined;
    let imageFile: File | null = null;
    let externalImageUrl: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      productId = (formData.get('productId') as string) || '';
      title = (formData.get('title') as string) || undefined;
      description = (formData.get('description') as string) || undefined;
      const rawPrice = formData.get('price');
      if (rawPrice !== null && rawPrice !== undefined && rawPrice !== '') {
        price = parseFloat(rawPrice as string);
      }
      const rawInStock = formData.get('inStock');
      if (rawInStock !== null && rawInStock !== undefined) {
        inStock = rawInStock === 'true' || rawInStock === '1';
      }
      brand = (formData.get('brand') as string) || undefined;
      color = (formData.get('color') as string) || undefined;
      externalImageUrl = (formData.get('imageUrl') as string) || undefined;

      const file = formData.get('imageFile');
      if (file && typeof file === 'object' && 'arrayBuffer' in file && (file as File).size > 0) {
        imageFile = file as File;
      }
    } else {
      const body = await req.json();
      productId = body.productId;
      title = body.title;
      description = body.description;
      if (body.price !== undefined) price = parseFloat(body.price);
      if (body.inStock !== undefined) inStock = Boolean(body.inStock);
      brand = body.brand;
      color = body.color;
      externalImageUrl = body.imageUrl;
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID (_id) is required.' },
        { status: 400 }
      );
    }

    const sanityClient = getAdminSanityClient();
    const patchData: Record<string, any> = {};

    if (title !== undefined) patchData.title = title.trim();
    if (description !== undefined) patchData.description = description.trim();
    if (price !== undefined && !isNaN(price)) patchData.price = price;
    if (inStock !== undefined) patchData.inStock = inStock;
    if (brand !== undefined) patchData.brand = brand.trim();
    if (color !== undefined) patchData.color = color.trim();

    // Handle new image upload from file
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = imageFile.name || `product-${Date.now()}.jpg`;
      const fileType = imageFile.type || 'image/jpeg';

      const uploadedAsset = await sanityClient.assets.upload('image', buffer, {
        filename,
        contentType: fileType,
      });

      const imageReference = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: uploadedAsset._id,
        },
      };

      patchData.image = imageReference;
      patchData.images = [imageReference];
    } else if (externalImageUrl && externalImageUrl.trim().startsWith('http')) {
      // Fetch external image and upload to Sanity
      try {
        const imageRes = await fetch(externalImageUrl.trim());
        if (imageRes.ok) {
          const arrayBuffer = await imageRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const ext = imageRes.headers.get('content-type') || 'image/jpeg';
          const uploadedAsset = await sanityClient.assets.upload('image', buffer, {
            filename: `product-${Date.now()}.jpg`,
            contentType: ext,
          });

          const imageReference = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedAsset._id,
            },
          };

          patchData.image = imageReference;
          patchData.images = [imageReference];
        }
      } catch (imgErr) {
        console.error('Failed to upload external image to Sanity:', imgErr);
      }
    }

    // Apply patch to Sanity product
    const updated = await sanityClient.patch(productId).set(patchData).commit();

    return NextResponse.json({
      success: true,
      product: updated,
      message: 'Product updated successfully in Sanity!',
    });
  } catch (error: any) {
    console.error('Admin product update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update product.' },
      { status: 500 }
    );
  }
}
