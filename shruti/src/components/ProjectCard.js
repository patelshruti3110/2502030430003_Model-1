function ProjectCard(props) {
return (
<div className="bg-slate-800 p-6 rounded-xl shadow-lg">
<img
src={props.image}
alt="project"
className="rounded-lg mb-4"
/>
<h2 className="text-2xl font-bold mb-3">{props.title}</h2>
<p className="mb-4">{props.description}</p>
<div className="flex gap-4">
<a
href={props.github}
className="bg-indigo-600 px-5 py-2 rounded"
>
GitHub
</a>
<a
href={props.demo}
className="bg-purple-600 px-5 py-2 rounded"
>
Live Demo
</a>
</div>
</div>
);
}
export default ProjectCard;