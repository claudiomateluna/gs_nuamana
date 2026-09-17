import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    // Return empty reviews instead of 500 — the component degrades gracefully
    // with an empty state. A 500 triggers retries and pollutes the console.
    return NextResponse.json({ reviews: [], source: 'unconfigured' });
  }

  try {
    // 1. Intentamos con el endpoint de Places API (Legacy Details) que es la opción estándar habilitada por la mayoría
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&language=es&key=${apiKey}`;
    
    let res = await fetch(legacyUrl, {
      next: { revalidate: 86400 } // Caché por 24 horas para no agotar la cuotas
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'OK' && data.result) {
        const reviewsFormatted = (data.result.reviews || []).map((r: any) => ({
          authorName: r.author_name,
          profilePhoto: r.profile_photo_url,
          rating: r.rating,
          text: r.text,
          relativeTime: r.relative_time_description,
          authorUrl: r.author_url,
        }));

        return NextResponse.json({
          source: 'legacy',
          placeName: data.result.name,
          rating: data.result.rating,
          userRatingsTotal: data.result.user_ratings_total,
          reviews: reviewsFormatted,
        });
      }
    }

    // 2. Fallback a Places API (New) por si habilitó la nueva versión de la API de Google
    const newUrl = `https://places.googleapis.com/v1/places/${placeId}?languageCode=es`;
    const newRes = await fetch(newUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews',
      },
      next: { revalidate: 86400 }
    });

    if (newRes.ok) {
      const newData = await newRes.json();
      const reviewsFormatted = (newData.reviews || []).map((r: any) => ({
        authorName: r.authorAttribution?.displayName || 'Usuario de Google',
        profilePhoto: r.authorAttribution?.photoUri || '',
        rating: r.rating,
        text: r.text?.text || '',
        relativeTime: r.relativePublishTimeDescription || '',
        authorUrl: r.authorAttribution?.uri || '',
      }));

      return NextResponse.json({
        source: 'new',
        placeName: newData.displayName?.text,
        rating: newData.rating,
        userRatingsTotal: newData.userRatingCount,
        reviews: reviewsFormatted,
      });
    }

    // Both Google APIs failed — return empty reviews instead of an error
    // so the component renders gracefully without retries.
    return NextResponse.json({ reviews: [], source: 'unavailable' });
  } catch (error: any) {
    // Network or parsing error — return empty reviews, not 500.
    return NextResponse.json({ reviews: [], source: 'error' });
  }
}
