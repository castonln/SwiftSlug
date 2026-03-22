<div align="center">
  <img width="128" alt="swift-slug-icon" src="https://github.com/user-attachments/assets/ee6585ef-9870-4261-b131-53463a3471c2" />
  <h1>SwiftSlug</h1>
  <p>https://swift-slug.vercel.app/</p>
  <p>A free, quick, and simple web-based word processor for screenwriting.</p>
  <img alt="image" src="https://github.com/user-attachments/assets/6fea5273-bd54-4423-bc29-b81a0dbda579" />
</div>

<h2>What is SwiftSlug?</h2>
<p>I took several screenwriting classes as free electives back in college. Each semester, I wrestled with a new piece of software to get my work done. <em>Trelby, Arc Studio,</em> etc. I eventually settled on writing pure Fountain in a text document and updating a PDF exporter window every few minutes in VSCode to get a good gauge on my page lengths! What a nightmare. But hey, at least it was free. The truth is, there's few free WYSIWYG editors that just provide the bare necessities for burgeoning screenwriting students.</p>

<p>SwiftSlug is a small project of mine that's attempting to correct that. It's a <strong>dead simple</strong> screenplay editor made to <strong>get something readable out the door ASAP</strong> right from your browser with <strong>no sign in required.</strong> If you're coming from or thinking you'll move to a different editor, you can bring your scripts with you via <strong>.fountain imports and exports,</strong> making SwiftSlug compatable with <em>Arc Studio, Fade In, Highland Pro, WriterDuet,</em> and most other industry-standard screenwriting tools.</p>

<h2>Development Process</h2>
<h3>Early Wireframes</h3>
<div float="left" align="center">
  <img alt="image" width="400px" src="https://github.com/user-attachments/assets/b69c0f2c-67ec-4eb5-b7d6-f7bec969d6a5" />
  <img alt="image" width="400px" src="https://github.com/user-attachments/assets/299dbb9f-dd7f-4691-b144-ac3db96d1f63" />
</div>
<p>My design process began on paper where I established the needs of each possible component and what the scope of my project may be.</p>
<p>I decided to keep the design as streamlined as possible. No landing page, no sign in, no extraeous features.</p>
<p>For the general feel, I went for sharp corners and a white emulation of paper. I wanted the app to give the impression of robustness and familiarity.</p>
<img alt="image" height="400px" src="https://github.com/user-attachments/assets/5d4ea9d7-8ade-47a0-abc5-62e40e32e1e0" align="left" />
<h3>Editor Node State Flow</h3>
<p>I mapped this state diagram in trying to figure out how one editor node could reach another from any point in a document.</p>

<p>This is also when I formally established my desire to keep everything feeling as "free as possible." As in, no hotkeys or mouse usage required. Everything should be naturally typed or done with single keypresses to keep editing fast.</p>

<p>I identified how keyboard input triggered nodes (like parentheticals or scene headings) would be difficult to get right. Luckily, TipTap provided InputRules to deal with this.</p>

<br clear="left" />

<h3>Built With</h3>
<ul>
  <li><strong>Vercel</strong> for deployment</li>
  <li><strong>React + Vite</strong> for frontend library / framework</li>
  <li><strong>TipTap + ProseMirror</strong> for editor framework</li>
</ul>

# Roadmap
- [x] Single page implementation
- [x] Deployment to Vercel
- [ ] Add MongoDB backend and Firebase *optional* login for free cloud backups
- [ ] Dark mode
- [ ] Reimplement pagination instead of using library for greater flexibility when exporting to pdf
- [ ] Suggestion bubble for scene headings and characters
