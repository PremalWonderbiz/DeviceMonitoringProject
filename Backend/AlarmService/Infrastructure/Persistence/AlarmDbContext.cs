using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class AlarmDbContext : DbContext
    {
        public AlarmDbContext(DbContextOptions<AlarmDbContext> options)
            : base(options)
        {
        }

        public DbSet<Alarm> Alarms => Set<Alarm>();
        public DbSet<AlarmRule> AlarmRules { get; set; }
        public DbSet<AlarmState> AlarmStates => Set<AlarmState>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Alarm>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SourceDeviceMacId).IsRequired();
                entity.Property(e => e.Message).IsRequired();
                entity.Property(e => e.Severity)
                      .HasConversion<string>(); //store enum as string
                entity.Property(e => e.ResolvedAt)
                      .IsRequired(false);

                // State Foreign key
                entity.HasOne(e => e.State)
                      .WithMany(s => s.Alarms)
                      .HasForeignKey(e => e.StateId)
                      .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

                entity.Property(e => e.StateId).IsRequired();
            });

            modelBuilder.Entity<AlarmRule>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.DeviceMacId).IsRequired();
                entity.Property(e => e.FieldPath).IsRequired();
                entity.Property(e => e.Operator).IsRequired();
                entity.Property(e => e.ThresholdValue).IsRequired();
                entity.Property(e => e.MessageTemplate).IsRequired();

                entity.Property(e => e.Severity)
                      .HasConversion<string>(); // Save enum as string

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}
