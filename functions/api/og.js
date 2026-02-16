export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();

        const getMetaTag = (name) => {
            const regex = new RegExp(`<meta property="og:${name}" content="(.*?)"`);
            const match = html.match(regex);
            return match ? match[1] : null;
        };
        
        const getTitle = () => {
            const match = html.match(/<title>(.*?)<\/title>/);
            return match ? match[1] : null;
        }

        const getDescription = () => {
             const regex = new RegExp(`<meta name="description" content="(.*?)"`);
            const match = html.match(regex);
            return match ? match[1] : null;
        }

        const data = {
            title: getMetaTag('title') || getTitle(),
            description: getMetaTag('description') || getDescription(),
            image: getMetaTag('image'),
        };

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: `Failed to fetch or parse the URL: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
