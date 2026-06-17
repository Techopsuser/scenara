/**
 * One-off cleanup: removes ALL predefined / manually-added scenarios,
 * solutions and votes so the platform shows only live, user-generated data.
 * Keeps: technologies (the 120+ seeded stack list) and real registered users.
 *
 * Run: `bun run prisma/cleanup.ts`
 */
import { db } from '../src/lib/db'

async function main() {
  console.log('Cleaning predefined / manual data…')

  const votes = await db.vote.deleteMany({})
  const solutions = await db.solution.deleteMany({})
  const scenarioTech = await db.scenarioTechnology.deleteMany({})
  const scenarios = await db.scenario.deleteMany({})
  // remove the seed-only demo user (sentinel passwordHash); keep real users
  const demoUser = await db.user.deleteMany({
    where: { passwordHash: 'demo-no-login' },
  })

  console.log(`  deleted ${votes.count} votes`)
  console.log(`  deleted ${solutions.count} solutions`)
  console.log(`  deleted ${scenarioTech.count} scenario-tech links`)
  console.log(`  deleted ${scenarios.count} scenarios`)
  console.log(`  deleted ${demoUser.count} demo users`)

  const remaining = await db.scenario.count()
  const techs = await db.technology.count()
  const users = await db.user.count()
  console.log(
    `\nDone. Remaining: ${remaining} scenarios, ${techs} technologies, ${users} real users.`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
