import slugify from '../utils/slug.js';
import { env } from '../config/env.js';

/**
 * Seed data for The Draft. Fixed slugs and dates keep the seed idempotent:
 * rerunning it never creates duplicates and never overwrites posts the editor
 * has since changed.
 */
const categories = [
  { name: 'Design', slug: 'design' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Culture', slug: 'culture' },
];

const posts = [
  {
    title: 'The Quiet Power of a Well-Set Page',
    slug: 'the-quiet-power-of-a-well-set-page',
    categorySlug: 'design',
    excerpt:
      'Typography is not decoration. It is the room where the writing happens, and the reader can feel its proportions before they read a word.',
    coverImageUrl: 'https://picsum.photos/seed/draft-well-set-page/1600/1000',
    status: 'published',
    publishedAt: '2026-11-06 09:00:00',
    createdAt: '2026-11-03 10:15:00',
    body: `A good page never announces itself. It simply gets out of the way — the line lengths are forgiving, the margins breathe, and the words arrive without friction. That kind of quiet is not an accident. It is the result of a hundred small decisions made before the reader ever shows up.

## The page as a room

Think of a page the way an editor thinks of a room. The type is furniture: it should be arranged so that people can move through it without bumping into anything. Measure, leading, and contrast are the floor plan.

> Typography is the craft of endowing human language with a durable visual form.
>
> — Robert Bringhurst

Most reading problems are spatial. A line that runs too long exhausts the eye. A column that is too narrow breaks the rhythm of a sentence. The fix is rarely decorative. It is almost always structural.

## Three things to get right

- **Measure.** Aim for 60 to 75 characters per line. Anything wider and the reader starts losing their place on the return sweep.
- **Leading.** Give the line room to breathe. Body text usually wants 1.5 to 1.7 times its font size.
- **Contrast.** Near-black on warm paper is easier on the eye than pure black on pure white, and it leaves space for an accent to do real work.

None of this requires a budget. It requires patience, and the willingness to treat the reader's attention as something borrowed rather than owned.

## Set it, then leave it alone

The best typography is invisible in the way a good host is invisible: present, attentive, and never in the middle of the conversation. Set the page with care, then trust the words to carry the room.

For a deeper dive, Bringhurst's [The Elements of Typographic Style](https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style) remains the place to begin.`,
  },
  {
    title: 'The Small Web Is Having a Moment',
    slug: 'the-small-web-is-having-a-moment',
    categorySlug: 'technology',
    excerpt:
      'Personal sites and hand-written feeds are back. The internet is remembering that it was always an archipelago, not a river.',
    coverImageUrl: 'https://picsum.photos/seed/draft-small-web/1600/1000',
    status: 'published',
    publishedAt: '2026-10-29 08:30:00',
    createdAt: '2026-10-25 14:20:00',
    body: `Every few years the web rediscovers its own front porch. This time the porch is small: a personal site, a hand-written feed, a page that loads in the time it takes to blink.

## The feed is not the web

The algorithmic feed trained us to think of the internet as a single river. In practice it is closer to an archipelago — thousands of small islands, each with its own weather. The pleasure of the small web is the pleasure of visiting somewhere specific.

> A personal website is a room you own. A social profile is a room you rent.

## What comes back

When people publish on their own sites, a few things return at once:

1. **Memory.** Posts do not vanish because a platform changed its mind.
2. **Texture.** A site can look like its author, not like everyone else's template.
3. **Links.** Real links, between real pages, with context on both ends.

None of this is nostalgia. It is a correction. The big platforms optimized for reach; the small web optimizes for belonging.

## Start smaller than you think

You do not need a publishing strategy. You need one page, one idea, and the willingness to hit publish before the idea is perfect. A site with three honest posts is worth more than a draft folder with thirty.

The tools have never been better, and the audience has never been more tired of being herded. Put up a page. Link to someone else's. See what happens.`,
  },
  {
    title: 'A Field Guide to Editorial Color',
    slug: 'a-field-guide-to-editorial-color',
    categorySlug: 'design',
    excerpt:
      'Warm paper, near-black ink, one vivid accent. A magazine can run on three colors and still feel inexhaustible.',
    coverImageUrl: null,
    status: 'published',
    publishedAt: '2026-10-18 11:00:00',
    createdAt: '2026-10-12 09:45:00',
    body: `Color is the loudest thing on a page, which is why it deserves the most restraint. A magazine can run on three colors and still feel inexhaustible.

## Pick a temperature, not a palette

Warm paper, near-black ink, one vivid accent. That is enough to build an entire issue. The accent is not decoration; it is a signal, and signals lose meaning when everything is shouting.

> When every element is emphasized, nothing is.

## The five percent rule

Try keeping any single accent color under five percent of the visible page. Use it for the thing you most want a reader to do: a link, a section marker, the one line that matters. The rest of the page earns its authority through hierarchy, not hue.

- **Paper** sets the mood before a single word is read.
- **Ink** carries the argument.
- **Accent** points at the door.

## Test it in grayscale

Squint, or print the layout in black and white. If the hierarchy still works, the color is doing its job as a bonus rather than a crutch. If it collapses, no amount of saturation will save it.

Good editorial color is not a scheme. It is a decision about where attention goes, repeated with discipline across every page.`,
  },
  {
    title: 'Notes on Slowness, From a Print Desk',
    slug: 'notes-on-slowness-from-a-print-desk',
    categorySlug: 'culture',
    excerpt:
      'A deadline is a form of respect — for the reader, for the subject, and for the next story waiting behind this one.',
    coverImageUrl: null,
    status: 'published',
    publishedAt: '2026-10-07 10:00:00',
    createdAt: '2026-10-02 16:10:00',
    body: `The print desk is a good place to learn about deadlines and an even better place to learn about patience. A page that closes on Thursday does not reopen on Friday because someone had a better idea.

## The draft has a clock

Digital work tends to stretch to fill the time it is given. Print work cannot. The constraint is the point: it forces a decision, and a decision is what turns a draft into an object.

> You do not finish a story. You stop working on it.

That sounds cynical. It is not. A deadline is a form of respect — for the reader, for the subject, and for the next story waiting behind this one.

## A small ritual

Before a piece goes out, read it once out loud. Not for typos; for rhythm. The places where you stumble are the places a reader will stumble, and they are almost never the places you expected.

Then close the file. Sleep. Read it once more in the morning with a pen in hand. You will find the real ending on the second pass.

Slowness is not the same as delay. It is the difference between a page that was assembled and a page that was considered.`,
  },
  {
    title: 'Interfaces That Know When to Get Out of the Way',
    slug: 'interfaces-that-know-when-to-get-out-of-the-way',
    categorySlug: 'technology',
    excerpt:
      'The highest compliment a reader can pay an interface is silence. Design for the moment after the click, not the click itself.',
    coverImageUrl: 'https://picsum.photos/seed/draft-interfaces/1600/1000',
    status: 'published',
    publishedAt: '2026-09-24 09:15:00',
    createdAt: '2026-09-19 11:30:00',
    body: `The best interface is the one you stop noticing. You press the button, the thing happens, and your attention returns to whatever you actually cared about.

## Friction is a design material

Not all friction is bad. A confirmation before deleting an archive is friction doing useful work. A modal that appears before you can read an article is friction with no job at all.

> The question is never "how few clicks?" It is "which clicks deserve to exist?"

## Three tests

1. **Does it interrupt a thought?** If yes, it had better be important.
2. **Does it explain itself?** A control that needs a tooltip to be understood is a control that is not finished.
3. **Does it recover gracefully?** Errors are part of the interface, not an exception to it.

## Get out of the way

The highest compliment a reader can pay an interface is silence. They did not notice the navigation, the loading state, the type scale, or the color. They noticed the story.

Design for that moment. Everything else is scaffolding.`,
  },
  {
    title: 'What We Owe the Reader',
    slug: 'what-we-owe-the-reader',
    categorySlug: 'culture',
    excerpt:
      'A magazine is a promise made to a stranger. Twenty minutes of attention, traded for something worth the trade.',
    coverImageUrl: null,
    status: 'published',
    publishedAt: '2026-09-12 12:00:00',
    createdAt: '2026-09-08 08:40:00',
    body: `An editor once told me that a magazine is a promise made to a stranger. The stranger gives you twenty minutes; you give them something worth the trade.

## The promise

That promise has three parts. Be clear about what this is. Be generous with what you know. And never waste the reader's time to make yourself look clever.

> Assume the reader is intelligent and busy. Both are true more often than we admit.

## Editing is an act of hospitality

Cutting a paragraph is not a loss if it helps the reader arrive sooner. Adding a transition is not padding if it keeps them from getting lost. Every editorial decision is a small act of care, or it is noise.

A few questions worth asking of every draft:

- What does the reader know at the end that they did not know at the start?
- Where will they get bored, and why?
- What can be removed without weakening the piece?

## Keep the door open

The last line of a story should feel like a door left ajar, not a wall. Readers who finish should know where to go next — another piece, a related idea, a reason to come back.

That is the whole exchange. Attention for care. It is still the best deal on the internet.`,
  },
  {
    title: 'The Case for the Unfinished Draft',
    slug: 'the-case-for-the-unfinished-draft',
    categorySlug: 'culture',
    excerpt:
      'There is a folder on every writer\\'s desktop called "almost." This is an argument for opening it.',
    coverImageUrl: null,
    status: 'draft',
    publishedAt: null,
    createdAt: '2026-11-01 09:00:00',
    body: `There is a folder on every writer's desktop called something like "almost." It contains the pieces that were ninety percent done and then quietly abandoned.

## The myth of the finished thing

We talk about finished work as if it were a different category of object. In practice, publishing is a decision, not a transformation. The piece does not become complete; it becomes public.

> A draft is not a failure. It is a hypothesis about a story.

## What "almost" is protecting you from

Keeping work unfinished is a way of keeping it safe. The unpublished draft cannot be misunderstood, criticized, or ignored. It also cannot be read.

That trade is worth naming. Sometimes the protection is worth it. Often it is just fear wearing a very reasonable cardigan.

## Ship the draft

Not every draft. But the one you keep reopening. The one whose first paragraph you still believe. Give it a deadline, a read-through, and a door.

The unfinished draft is not a monument to your standards. It is a story waiting for someone to decide it is ready enough.`,
  },
];

async function seed() {
  const connection = await (await import('./pool.js')).pool.getConnection();
  try {
    await connection.beginTransaction();

    const [adminRows] = await connection.query(
      'SELECT id, email FROM users ORDER BY id ASC LIMIT 1'
    );
    if (adminRows.length === 0) {
      throw new Error(
        'No admin account exists yet. Run `npm run create-admin` first, then rerun `npm run seed` so sample posts have an author.'
      );
    }
    const authorId = adminRows[0].id;

    for (const category of categories) {
      await connection.execute(
        `INSERT INTO categories (name, slug) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [category.name, category.slug]
      );
    }

    const [categoryRows] = await connection.query('SELECT id, slug FROM categories');
    const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

    let inserted = 0;
    for (const post of posts) {
      const categoryId = categoryIds.get(post.categorySlug);
      if (!categoryId) throw new Error(`Unknown seed category: ${post.categorySlug}`);

      const [result] = await connection.execute(
        `INSERT IGNORE INTO posts
          (title, slug, excerpt, body, cover_image_url, status, category_id, author_id, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.title,
          post.slug || slugify(post.title),
          post.excerpt,
          post.body,
          post.coverImageUrl,
          post.status,
          categoryId,
          authorId,
          post.publishedAt,
          post.createdAt,
          post.publishedAt || post.createdAt,
        ]
      );
      inserted += result.affectedRows;
    }

    await connection.commit();
    console.log(
      `Seed complete: ${categories.length} categories, ${posts.length} posts (${inserted} inserted, ${posts.length - inserted} already present).`
    );
    console.log(`Sample content is authored by user id ${authorId} (${adminRows[0].email}).`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

seed()
  .then(async () => {
    const { pool } = await import('./pool.js');
    await pool.end();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
    try {
      const { pool } = await import('./pool.js');
      await pool.end();
    } catch {
      /* ignore */
    }
  });
