
import './skills.css';
import Tools from './Tools';
import Langugaes from './Langugaes';


const Skills = () => {
  return (
    <section className="skills section" id="skills">
      <h2 className="section__title">Skills</h2>
      <span className="section__subtitle">My Skillset...</span>

      <div className="skills__container container grid">
        <Langugaes />
        <Tools />

      </div>
    </section>

  )
}

export default Skills